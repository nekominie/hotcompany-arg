# AGENTS.md - Proyecto FISINOR (ARG Web System)

## Visión General del Proyecto
Este repositorio alberga la plataforma web para "FISINOR S.A. de C.V.", una empresa ficticia de biotecnología utilizada en un Juego de Realidad Alternativa (ARG) ambientado en Hermosillo, Sonora. La web debe simular una multinacional de 100 millones de dólares con un diseño pulcro y corporativo, escondiendo sutilmente elementos de terror corporal y biomecánico.

## Tech Stack
- **Frontend:** Vue 3 (`<script setup lang="ts">`) + Vite + TypeScript.
- **Styling:** Tailwind CSS (Estilo editorial/institucional).
- **Backend (Futuro):** ASP.NET Core (C# API REST).
- **Servidor Web:** Nginx + Cloudflare Proxy.

## Reglas de Arquitectura y Código
1. **Zero Hardcoding Rule:** NINGÚN texto, titular, aviso, URL de imagen o configuración debe estar escrito directamente dentro de los componentes `.vue`.
2. **Configuración Centralizada:** Todo el contenido debe leerse dinámicamente desde el objeto exportado en `src/config/fisinorConfig.ts`.
3. **Estética Visual (WordPress Corporativo Heavy):**
   - Paleta: Blanco (#FFFFFF), Gris Hospitalario (#F1F5F9), Azul Cian (#00A8CC), Naranja Desierto (#FF9F1C) y Azul Oscuro (#0F172A).
   - Encabezados en Serif elegantes (`Playfair Display` / `Georgia`) y cuerpo en Sans-serif limpia (`Inter`).
   - Fotografías en alta resolución con encuadre médico/científico profesional.

## Privacidad y Blindaje de Identidad (Crítico)
- NUNCA habilitar `sourcemap` en la build de producción (`vite.config.ts` debe tener `sourcemap: false`).
- NUNCA incluir nombres personales, correos reales o referencias a autores en `package.json`, comentarios de código o commits de Git.
- Todos los commits deben realizarse bajo la identidad del sistema: `FISINOR System <admin@fisinor.com>`.

## Comandos Principales
- Desarrollo: `npm run dev`
- Build de Producción: `npm run build`
- Vista previa de build: `npm run preview`

## Estado Actual de Desarrollo
- **Fase:** Capítulo 1 - Landing Page Corporativa Institucional (Estática).
- **Próxima Fase:** Integración del Portal de Empleados y transición visual a la terminal intranet.