# Guía de despliegue de pruebas - FISINOR

Esta guía explica cómo desplegar el stack completo de FISINOR (API + 4 frontends) en un servidor público para **pruebas controladas**. Funciona tanto en Linux como en **Windows 11 Pro** usando WSL2 + Docker Desktop.

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

### Linux

- Linux con Docker 24+ y Docker Compose (plugin `docker compose`).
- Git.
- Acceso root o usuario en grupo `docker`.
- (Recomendado) dominio y subdominios apuntando al servidor.

### Windows 11 Pro

La forma más sencilla de usar este stack en Windows 11 Pro es mediante **WSL2 + Docker Desktop**:

1. Habilita WSL2:
   - Abre PowerShell como administrador y ejecuta:
     ```powershell
     wsl --install -d Ubuntu
     ```
   - Reinicia si lo pide. WSL2 instalará Ubuntu.
2. Instala **Docker Desktop para Windows** desde [docker.com](https://www.docker.com/products/docker-desktop/).
   - Durante la instalación elige **Use WSL 2 instead of Hyper-V**.
   - En Docker Desktop → Settings → Resources → WSL Integration, activa la integración con la distro Ubuntu.
3. Dentro de Ubuntu instala Git:
   ```bash
   sudo apt update && sudo apt install -y git
   ```
4. Abre el firewall de Windows para los puertos `8080`, `8081`, `8082`, `8083` y `8085`:
   - Windows Defender Firewall → Advanced Settings → Inbound Rules → New Rule.
   - Tipo **Port** → TCP → `8080-8085` → **Allow the connection** → aplica a todos los perfiles (Domain, Private, Public).
   - Si usas un proveedor cloud (AWS, Azure, etc.), abre también el security group correspondiente.

> Recomendación: ejecuta todos los comandos de esta guía **dentro de WSL2 Ubuntu**, no desde PowerShell, para evitar problemas de permisos de archivos entre Windows y Linux.

---

## 3. Preparar el código

Dentro de WSL2 Ubuntu (o en Linux), crea una carpeta y clona los repositorios:

```bash
mkdir -p ~/fisinor && cd ~/fisinor

git clone https://github.com/nekominie/hot-company-api.git
git clone https://github.com/nekominie/hot-company-admin.git
git clone https://github.com/nekominie/hot-company-clients.git
git clone https://github.com/nekominie/hot-company-employees.git
git clone https://github.com/nekominie/hotcompany-arg.git

for d in hot-company-api hot-company-admin hot-company-clients hot-company-employees hotcompany-arg; do
  git -C "$d" checkout deploy/public-test-stack
done
```

Coloca en esta misma carpeta los archivos `docker-compose.yml` y `.env.example` que acompañan esta guía (están en el PR de `hotcompany-arg`):

```bash
cp hotcompany-arg/.env.example .env.example
cp hotcompany-arg/docker-compose.yml docker-compose.yml  # si la incluyes ahí
```

```bash
cp .env.example .env
```

---

## 4. Configurar `.env`

Edita `.env` con los valores reales de tu servidor.

Ejemplo para pruebas por IP y puertos directos (sustituye `203.0.113.10` por tu IP pública):

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
cd ~/fisinor
docker compose up --build -d
```

La primera construcción tarda varios minutos. Docker Compose descargará imágenes, compilará la API y los frontends Vite y ejecutará las migraciones de Entity Framework.

Verifica el estado:

```bash
docker compose ps
```

Prueba rápida desde WSL2:

```bash
curl -s -o /dev/null -w "ARG: %{http_code}\n" http://localhost:8080/
curl -s -o /dev/null -w "Admin: %{http_code}\n" http://localhost:8081/
curl -s -o /dev/null -w "Clientes: %{http_code}\n" http://localhost:8082/
curl -s -o /dev/null -w "Empleados: %{http_code}\n" http://localhost:8083/
curl -s -o /dev/null -w "API: %{http_code}\n" http://localhost:8085/api/v1/client-auth/me
```

Deberías obtener `200` en los frontends y `401` en la API (la API rechaza la petición anónima, lo cual es correcto).

> En Windows, si Docker Desktop está corriendo con WSL2 backend, los puertos también están disponibles en `http://localhost:8080` desde el propio Windows. Para probar desde otra máquina usa la IP pública del servidor.

---

## 6. Opción A - Exponer por puertos directos (rápido, menos seguro)

Si solo quieres una prueba funcional rápida:

1. Asegúrate de que el firewall de Windows (y el security group de tu proveedor cloud, si aplica) permita los puertos `8080`, `8081`, `8082`, `8083` y `8085`.
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
fisinor.com            A  203.0.113.10
admin.fisinor.com      A  203.0.113.10
clientes.fisinor.com   A  203.0.113.10
empleados.fisinor.com  A  203.0.113.10
api.fisinor.com        A  203.0.113.10   # opcional, ver nota abajo
```

### 7.2 Reverse proxy con nginx + Certbot (dentro de WSL2 Ubuntu)

Instala nginx y Certbot en WSL2:

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

> En WSL2 no hay `systemd` por defecto. Si `systemctl` falla, inicia nginx con `sudo service nginx start` o configura systemd en WSL2 (`/etc/wsl.conf` con `[boot] systemd=true`).

Obtén certificados SSL:

```bash
sudo certbot --nginx -d fisinor.com -d admin.fisinor.com -d clientes.fisinor.com -d empleados.fisinor.com
```

Certbot ajustará automáticamente los bloques a HTTPS.

### 7.3 Nota sobre la API

La API no necesita un subdominio propio si los frontends la llaman a través de `/api` (gracias al proxy interno de nginx de cada frontend). Si quieres acceder directamente (Swagger, Postman), añade `api.fisinor.com` apuntando al puerto `8085`.

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

### 7.5 Exponer nginx de WSL2 al exterior

Por defecto, los servicios que escuchan dentro de WSL2 (como nginx en el puerto 80/443) no están expuestos automáticamente a la red pública de Windows. Tienes dos opciones:

**Opción 1: proxy inverso en Windows**
Usa IIS o un proxy en Windows que redirija el tráfico de los puertos 80/443 al `localhost:80`/`localhost:443` de WSL2. Esto requiere configuración adicional.

**Opción 2: exponer nginx directamente desde WSL2**
Configura nginx para escuchar también en la IP de WSL2 o en `0.0.0.0` (ya lo hace por defecto) y abre los puertos 80 y 443 en el firewall de Windows. Desde fuera se accede a la IP pública de Windows; Windows reenvía el tráfico a WSL2 gracias a la traducción de puertos de localhost.

> La forma más fácil en un entorno real es tener un servidor Linux o un balanceador/cloud frontal (Nginx Proxy Manager, Traefik, Cloudflare Tunnel, etc.) y dejar el Windows/WSL2 solo en la red interna.

---

## 8. Tareas después del primer despliegue

### Crear un usuario administrador

La API no tiene un seed automático de empleados administradores. Para usar el panel (`admin.fisinor.com`), inserta manualmente un empleado:

```bash
docker exec -it fisinor-postgres psql -U kiara_ai -d fisinor_db
```

```sql
INSERT INTO employee_accounts (
  id, employee_number, email, password_hash, first_name,
  last_name_paternal, position, department, status, is_active, created_at
) VALUES (
  gen_random_uuid(), 'EMP-0001', 'admin@fisinor.com',
  '100000.SALT.HASH',
  'Admin', 'FISINOR', 'Administrador', 'Sistemas', 'disponible', true, NOW()
);
```

> Genera el hash real ejecutando `PasswordHasher.Hash("tu_contraseña")` en la API.

### Configurar correos

Para recuperación de contraseña, configura `RESEND_API_KEY` con una API key válida de [Resend](https://resend.com) y un remitente verificado.

---

## 9. Mantenimiento habitual

```bash
# Ver logs
docker compose logs -f fisinor-api

# Actualizar después de un cambio en algún repo
git -C hot-company-api pull origin deploy/public-test-stack
# (repite para cada repo)
docker compose up --build -d

# Backup de la base de datos
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
- Cadena de conexión vacía.
- PostgreSQL no está sano.
- Puerto `8085` ocupado en Windows o WSL2.

### Los frontends muestran pantalla en blanco

- Revisa que nginx sirva `index.html` para rutas SPA (`try_files $uri $uri/ /index.html;`).
- Abre las herramientas de desarrollador del navegador y verifica errores de red/CORS.

### Errores de CORS

`CORS_ALLOWED_ORIGINS` debe contener **exactamente** el protocolo, dominio y puerto usado. `https://` vs `http://` o un puerto distinto rompe CORS.

### Los archivos subidos desaparecen al reiniciar

Verifica el volumen:

```bash
docker volume ls | grep fisinor_uploads
docker exec fisinor-api ls -la /app/uploads
```

### WSL2 no tiene `systemd`

Si `systemctl` falla, inicia servicios manualmente:

```bash
sudo service nginx start
sudo service docker start   # si no usas Docker Desktop
```

O habilita systemd en WSL2 creando `/etc/wsl.conf`:

```ini
[boot]
systemd=true
```

y reiniciando WSL2:

```powershell
wsl --shutdown
```

---

## 11. Próximos pasos obligatorios antes de producción real

1. **Autenticación y autorización**: JWT/cookies de identidad y `[Authorize]` en controllers administrativos.
2. **Validación de contraseñas**: complejidad mínima.
3. **Rate limiting**: limitar login, reportes, etc.
4. **Secrets**: gestor de secretos en lugar de `.env`.
5. **Backups automáticos** de PostgreSQL y archivos subidos.
6. **Monitorización**: health checks y alertas.
7. **HTTPS forzoso** en todos los dominios.

---

## 12. Archivos entregados

- `docker-compose.yml`: orquesta PostgreSQL + API + 4 frontends.
- `.env.example`: plantilla de variables de entorno.
- `DEPLOY.md`: esta guía.
