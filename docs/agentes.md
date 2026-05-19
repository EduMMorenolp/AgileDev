# Agentes

## @pm-navigator (Primary - Tab)

Orquestador principal. Realiza ~12 preguntas agrupadas en lenguaje natural.
Lee `proyectos/_defaults.json` para precargar valores repetitivos.
Construye JSON plano con ~120 variables y coordina subagentes segun tipo.

**Permisos:** read + task (sin edit ni bash)

## @proyecto-nuevo

Valida prioridades de epicas, completa MVP y roadmap si estan vacios.
Devuelve JSON plano con solo las variables que modifico.

**Permisos:** read + edit

## @proyecto-existente

Lee la documentacion existente del proyecto, identifica que archivos
faltan y que secciones estan incompletas. Recomienda si conviene crear
desde cero o actualizar.

**Permisos:** read + edit

## @docs-creator

Genera todos los documentos del proyecto desde las plantillas:
- Reemplaza `{{variable}}` 1:1 con el JSON plano recibido
- Genera diagramas Mermaid.js (Gantt, QuadrantChart, Flowchart, Timeline)
- Deriva task cards por rol desde los datos del sprint
- Al finalizar, escribe `proyectos/[slug]/_variables.json` con el
  snapshot completo de las variables

**Permisos:** read + edit

## @docs-updater

Modifica documentacion existente sin sobrescribir:
- Usa SIEMPRE la herramienta `edit` (reemplazo exacto por bloques)
- NUNCA usa `write` en archivos existentes
- Busca anclas (headers `##` o `###`) para localizar bloques
- Si no encuentra el texto exacto, busca el header de seccion mas cercano
- Si no encuentra ni header, ABORTA y reporta el conflicto

**Permisos:** read + edit

## @docs-validator

Revisa automaticamente la calidad de los documentos:
- **Ortografia**: signos de apertura, tildes, mayusculas
- **Consistencia cruzada**: epicas en funcionales.md coinciden con backlog.md
- **TODO scan**: detecta `<!-- TODO -->` residuales
- **Secciones vacias**: contenido minimo por seccion
- **Terminologia**: mismo termino usado en todos los docs

Corrige errores simples automaticamente. Para inconsistencias graves, solo reporta.

**Permisos:** read + edit

## @agent-logs

Cada vez que se crea o modifica documentacion, escribe o actualiza
`proyectos/[slug]/changelog.md` con:
- Fecha y hora
- Accion (creacion / modificacion)
- Agente que lo solicito
- Archivos afectados
- Descripcion del cambio

**Permisos:** read + edit
