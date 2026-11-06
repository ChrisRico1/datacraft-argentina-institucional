# Diagnóstico: /api/radar/ipc responde "servicio no configurado"

## Resultado
- **Causa confirmada:** el secreto `INDEC_API_TOKEN` **no existe** en este proyecto. Los únicos secretos que hay son `LOVABLE_API_KEY` y `LOVABLE_CRON_SECRET`, que gestiona la plataforma.
- **Versión publicada:** el sitio publicado ya tiene la ruta `/api/radar/:indicator`. Respondió HTTP 503 con el mensaje exacto de la línea `if (!token)`, así que el código nuevo está en producción y llega a leer el token.
- **Cómo se lee el secreto:** está bien hecho para este entorno. `process.env.INDEC_API_TOKEN` se lee dentro del código que atiende cada consulta, que corre en el servidor, y no lleva el prefijo `VITE_`. Los secretos que se guardan en Configuración del proyecto → Secretos quedan disponibles así en producción. No hace falta tocar nada en Cloudflare ni en Wrangler: la parte de la documentación (`docs/radar-indec-integration.md`) que habla de ese panel no aplica a los sitios publicados con Lovable.

## Paso que falta
1. Abrí Configuración del proyecto → Secretos y agregá `INDEC_API_TOKEN` con el token del portal API-INDEC.
2. Volvé a publicar si hace falta y verificá `GET /api/radar/ipc?limit=1`. Debería responder 200 o 206 con datos. Si responde 502 diciendo "rechazó la autenticación", el token es inválido.

## Después (opcional, con tu aprobación)
- Actualizar la sección de configuración en `docs/radar-indec-integration.md` para que diga Lovable → Secretos en lugar del panel de Cloudflare.
