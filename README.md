# AgileDev Suite v1.1.0

Sistema CASE para la gestion integrada de preparacion de proyectos de software basado en Scrum, Ingenieria de Requerimientos y Control de Configuracion.

## Arquitectura de Agentes

### pm-navigator (Primary - Tab)
Orquestador principal. Realiza entrevista estructurada en 6 secciones, **resume** las respuestas, construye un bloque JSON y coordina a los subagentes via Task tool.

**Permisos:** read + task (sin edit ni bash)

### Subagentes

| Agente | Funcion | Permisos |
|--------|---------|----------|
| `@proyecto-nuevo` | Refina datos y estructura epicas para proyectos desde cero | read + edit |
| `@proyecto-existente` | Documenta proyectos en curso, detecta gaps | read + edit |
| `@docs-creator` | Genera docs desde plantillas; valida variables; max 1 repregunta; asigna `<!-- TODO -->` si falta | read + edit |
| `@docs-updater` | Modifica docs existentes usando SOLO `edit` por anclas Markdown. Nunca `write`. | read + edit |
| `@agent-logs` | Registra cada creacion/modificacion en `changelog.md` del proyecto | read + edit |

## Estructura del proyecto

```
Proyectos/AgileDev/
├── opencode.json
├── .opencode/agents/
│   ├── pm-navigator.md
│   ├── proyecto-nuevo.md
│   ├── proyecto-existente.md
│   ├── docs-creator.md
│   ├── docs-updater.md
│   └── agent-logs.md
├── templates/
│   ├── product-vision.md
│   ├── requerimientos/
│   │   ├── funcionales.md
│   │   └── no-funcionales.md
│   └── backlog/
│       ├── backlog.md
│       └── sprint-plan.md
└── proyectos/
    └── ejemplo/
        └── docs/
            ├── product-vision.md
            ├── requerimientos/
            └── backlog/
```

## Flujo de uso

1. Abre opencode y presiona **Tab** hasta `pm-navigator`
2. Di "hola" o "tengo un proyecto"
3. El navigador realiza la entrevista paso a paso (6 secciones)
4. Al completar, **resume** las respuestas y construye el bloque JSON
5. Invoca al subagente correspondiente (`@proyecto-nuevo` o `@proyecto-existente`) con los datos
6. Invoca `@docs-creator` con datos originales + refinados para generar los archivos
7. Invoca `@agent-logs` para registrar en `changelog.md`
8. Los documentos quedan en `proyectos/[nombre]/docs/`

## Manejo de estado entre agentes

El `pm-navigator` pasa los datos a cada subagente mediante un bloque JSON inline
dentro del prompt del Task tool:

```
===DATOS DEL PROYECTO===
```json
{
  "nombre_proyecto": "...",
  "vision": "resumen",
  ...
}
```
===FIN DATOS===
```

Los subagentes leen este bloque al inicio de su ejecucion. No acceden al
historial del chat ni a archivos temporales.

## Validacion de variables en templates

`@docs-creator` aplica esta politica:
1. Intenta reemplazar todas las `{{variable}}` con valores del JSON
2. Si falta un valor, **repregunta al usuario UNA SOLA vez**
3. Si el usuario no clarifica, asigna automaticamente `<!-- TODO: Pendiente de definir -->`
4. Nunca deja un marcador `{{variable}}` literal en el archivo final

## Idempotencia en @docs-updater

- Usa SIEMPRE la herramienta `edit` (reemplazo exacto por bloques)
- NUNCA usa `write` para modificar un archivo existente
- Busca **anclas** (headers `##` o `###`) para localizar bloques
- Si no encuentra el texto exacto, busca el header de seccion mas cercano
- Si no encuentra ni header, ABORTA y reporta el conflicto

## Control de Cambios (agent-logs)

Cada vez que se crea o modifica documentacion, `@agent-logs` escribe o
actualiza `proyectos/[nombre]/changelog.md` con:

- Fecha y hora
- Accion (creacion / modificacion)
- Agente que lo solicito
- Archivos afectados
- Descripcion del cambio

## Personalizacion

- Las plantillas en `templates/` pueden modificarse libremente
- Para cambiar la estructura de documentacion, edita los archivos `.md` en templates/
- Los templates usan marcadores `{{variable}}` que `@docs-creator` reemplaza automaticamente

## Requisitos

- OpenCode (version reciente)
- Ninguna dependencia externa (Python, Tesseract, ffmpeg, etc.)

## Licencia

MIT
