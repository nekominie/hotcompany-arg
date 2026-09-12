# Guía de despliegue de pruebas - FISINOR

Esta guía explica cómo desplegar el stack completo de FISINOR (API + 4 frontends) en un servidor público para **pruebas controladas**. Los cambios necesarios ya están implementados en las ramas `deploy/public-test-stack` de cada repositorio.

> ⚠️ **Advertencia de seguridad**: la API aún no tiene autenticación/autorización real en los controllers administrativos. No uses esta guía para datos de producción reales hasta corregir ese punto.

---

## 1. Estructura del stack

| Servicio | Puerto expuesto | Rol |
|----------|----------------|-----|
| `fisinor-arg` | `8080` | Landing / sitio principal |
| `fisinor-admin` | `8081` | Panel maestro (administración) |
| `fisinor-clients` | `8082` | Portal de clientes |
| `fisinor-employees` | `8083` | Portal de personal (StaffNet) |
| `fisinor-api` | `8085` | API ASP.NET Core 8 |
| `fisinor-postgres` | no expuesto | Base de datos PostgreSQL 16 |

Todos los frontends proxyan las llamadas a `/api` al servicio `fisinor-api:8080` internamente.

---

## 2. Prerequisitos en el servidor

- Linux con Docker 24+ y Docker Compose (plugin `docker compose`).
- Git.
- Acceso root o usuario en grupo `docker`.
- (Recomendado) dominio y subdominios apuntando al servidor.

---

## 3. Preparar el código

Clona los repositorios en la misma carpeta padre (por ejemplo `/opt/fisinor`):

```bash
mkdir -p /opt/fisinor && cd /opt/fisinor

git clone https://github.com/nekominie/hot-company-api.git
git clone https://github.com/nekominie/hot-company-admin.git
git clone https://github.com/nekominie/hot-company-clients.git
git clone https://github.com/nekominie/hot-company-employees.git
git clone https://github.com/nekominie/hotcompany-arg.git

for d in hot-company-api hot-company-admin hot-company-clients hot-company-employees hotcompany-arg; do
  git -C "$d" checkout deploy/public-test-stack
done
```

Coloca en esta misma carpeta los archivos `docker-compose.yml` y `.env.example` que acompañan esta guía.

```bash
cp .env.example .env
```

---

## 4. Configurar `.env`

Edita `.env` con los valores reales de tu servidor.

Ejemplo para pruebas por IP y puertos directos:

```dotenv
POSTGRES_PASSWORD=una_contraseña_muy_segura
ASPNETCORE_ENVIRONMENT=Production
CORS_ALLOWED_ORIGINS=http://203.0.113.10:8080,http://203.0.113.10:8081,http://203.0.113.10:8082,http://203.0.113.10:8083
RESEND_API_KEY=
RECOVERY_RESET_BASE_URL=http://203.0.113.10:8082/reset-password
```

Ejemplo para subdominios con HTTPS:

```dotenv
POSTGRES_PASSWORD=una_contraseña_muy_segura
ASPNETCORE_ENVIRONMENT=Production
CORS_ALLOWED_ORIGINS=https://fisinor.com,https://admin.fisinor.com,https://clientes.fisinor.com,https://empleados.fisinor.com
RESEND_API_KEY=re_tu_api_key_de_resend
RECOVERY_RESET_BASE_URL=https://clientes.fisinor.com/reset-password
```

> La variable `CORS_ALLOWED_ORIGINS` debe incluir exactamente las URLs desde las que se acceda a cada frontend.

---

## 5. Levantar el stack

```bash
cd /opt/fisinor
docker compose up --build -d
```

La primera construcción tarda varios minutos. Docker Compose descargará imágenes, compilará la API y los frontends Vite y ejecutará las migraciones de Entity Framework.

Verifica el estado:

```bash
docker compose ps
```

Prueba rápida desde el mismo servidor:

```bash
curl -s -o /dev/null -w "ARG: %{http_code}\n" http://localhost:8080/
curl -s -o /dev/null -w "Admin: %{http_code}\n" http://localhost:8081/
curl -s -o /dev/null -w "Clientes: %{http_code}\n" http://localhost:8082/
curl -s -o /dev/null -w "Empleados: %{http_code}\n" http://localhost:8083/
curl -s -o /dev/null -w "API: %{http_code}\n" http://localhost:8085/api/v1/client-auth/me
```

Deberías obtener `200` en los frontends y `401` en la API (la API rechaza la petición anónima, lo cual es correcto).

---

## 6. Opción A - Exponer por puertos directos (rápido, menos seguro)

Si solo quieres una prueba funcional rápida:

1. Abre los puertos `8080`, `8081`, `8082`, `8083` y `8085` en el firewall del servidor.
2. Asegúrate de que `CORS_ALLOWED_ORIGINS` incluya `http://<IP>:<puerto>` de cada frontend.
3. Accede directamente desde el navegador:
   - `http://203.0.113.10:8080` (landing)
   - `http://203.0.113.10:8081` (admin)
   - `http://203.0.113.10:8082` (clientes)
   - `http://203.0.113.10:8083` (empleados)

> No expongas puertos directos a internet con datos sensibles. Usa esta opción solo para validar funcionalidad.

---

## 7. Opción B - Exponer con subdominios y HTTPS (recomendado)

### 7.1 DNS

Apunta los subdominios a la IP pública del servidor:

```
fisinor.com       A  203.0.113.10
admin.fisinor.com A  203.0.113.10
clientes.fisinor.com A 203.0.113.10
empleados.fisinor.com A 203.0.113.10
api.fisinor.com   A  203.0.113.10   # opcional, ver nota abajo
```

### 7.2 Reverse proxy con nginx + Certbot

Instala nginx y Certbot en el host (no dentro de Docker):

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

Crea `/etc/nginx/sites-available/fisinor`:

```nginx
server {
    listen 80;
    server_name fisinor.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name admin.fisinor.com;

    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name clientes.fisinor.com;

    location / {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name empleados.fisinor.com;

    location / {
        proxy_pass http://localhost:8083;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilita el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/fisinor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Obtén certificados SSL:

```bash
sudo certbot --nginx -d fisinor.com -d admin.fisinor.com -d clientes.fisinor.com -d empleados.fisinor.com
```

Certbot ajustará automáticamente los bloques a HTTPS.

### 7.3 Nota sobre la API

La API no necesita un subdominio propio si los frontends la llaman a través de `/api` (gracias al proxy interno de nginx de cada frontend). Sin embargo, si quieres acceder directamente a ella (por ejemplo para Swagger o pruebas con Postman), añade un quinto subdominio apuntando al puerto `8085`.

```nginx
server {
    listen 443 ssl;
    server_name api.fisinor.com;

    location / {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7.4 Actualizar `.env` para HTTPS

```dotenv
CORS_ALLOWED_ORIGINS=https://fisinor.com,https://admin.fisinor.com,https://clientes.fisinor.com,https://empleados.fisinor.com
RECOVERY_RESET_BASE_URL=https://clientes.fisinor.com/reset-password
```

Reinicia el stack para aplicar los cambios:

```bash
docker compose down
docker compose up --build -d
```

---

## 8. Tareas después del primer despliegue

### Crear un usuario administrador

La API no tiene un seed automático de empleados administradores. Para poder usar el panel de administración (`admin.fisinor.com`), inserta manualmente un empleado en la base de datos o añade un endpoint/seed en la API antes del despliegue.

Ejemplo directo en PostgreSQL:

```bash
docker exec -it fisinor-postgres psql -U kiara_ai -d fisinor_db
```

```sql
INSERT INTO employee_accounts (
  id, employee_number, email, password_hash, first_name,
  last_name_paternal, position, department, status, is_active, created_at
) VALUES (
  gen_random_uuid(), 'EMP-0001', 'admin@fisinor.com',
  '100000.SALT.HASH',   -- reemplaza por un hash real generado con PasswordHasher
  'Admin', 'FISINOR', 'Administrador', 'Sistemas', 'disponible', true, NOW()
);
```

> Genera el hash real ejecutando localmente el método `PasswordHasher.Hash("tu_contraseña")` de la API.

### Configurar correos

Para que funcionen las recuperaciones de contraseña, configura `RESEND_API_KEY` con una API key válida de [Resend](https://resend.com) y un remitente verificado.

---

## 9. Mantenimiento habitual

```bash
# Ver logs
docker compose logs -f fisinor-api

# Actualizar después de un cambio en algún repo
git -C hot-company-api pull origin deploy/public-test-stack
# (repite para cada repo)
docker compose up --build -d

# Backups de la base de datos
docker exec fisinor-postgres pg_dump -U kiara_ai fisinor_db > fisinor_backup.sql

# Backup de archivos subidos
docker cp fisinor-api:/app/uploads ./fisinor_uploads_backup
```

---

## 10. Troubleshooting

### La API no arranca o reinicia continuamente

```bash
docker compose logs -f fisinor-api
```

Causas comunes:
- La cadena de conexión no está configurada (`ConnectionStrings__DefaultConnection` vacía).
- PostgreSQL aún no está sano; `depends_on` con `condition: service_healthy` debería esperar.
- Puerto `8085` ocupado.

### Los frontends muestran pantalla en blanco

- Revisa que nginx sirva `index.html` para rutas SPA (`try_files $uri $uri/ /index.html;`).
- Abre las herramientas de desarrollador del navegador y verifica errores de red/CORS.

### Errores de CORS

Asegúrate de que `CORS_ALLOWED_ORIGINS` contenga **exactamente** el protocolo, dominio y puerto desde el que accedes. Un `https://` versus `http://` o un puerto diferente rompe CORS.

### Los archivos subidos desaparecen al reiniciar

Asegúrate de que el volumen `fisinor_uploads` esté definido y montado. Verifica:

```bash
docker volume ls | grep fisinor_uploads
docker exec fisinor-api ls -la /app/uploads
```

---

## 11. Próximos pasos obligatorios antes de producción real

Antes de exponer este sistema a usuarios finales con datos reales:

1. **Autenticación y autorización**: añade JWT/cookies de identidad y atributos `[Authorize]` en todos los controllers administrativos.
2. **Validación de contraseñas**: exige complejidad mínima en registros y cambios de contraseña.
3. **Rate limiting**: limita intentos de login y envío de reportes.
4. **Secrets**: usa un gestor de secretos (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) en lugar de `.env` en el servidor.
5. **Backups automáticos**: programa dumps diarios de PostgreSQL y archivos subidos.
6. **Monitorización**: añade health checks persistentes y alertas.
7. **HTTPS forzoso**: redirige todo el tráfico HTTP a HTTPS.

---

## 12. Resumen de archivos entregados

- `docker-compose.yml`: orquesta PostgreSQL + API + 4 frontends.
- `.env.example`: plantilla de variables de entorno.
- `DEPLOY.md`: esta guía.
