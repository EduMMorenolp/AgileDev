---
description: "Asistente de instalacion - Verifica dependencias, instala paquetes Python y guia la configuracion de Tesseract OCR y ffmpeg en Windows"
mode: subagent
prompt: "{file:./prompts/setup-assistant.txt}"
permission:
  read: allow
  edit: allow
  bash: ask
  webfetch: ask
---
