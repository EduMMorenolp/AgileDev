# Changelog — AgileDev Suite

Todas las versiones notables de AgileDev Suite.

## v1.3.0 (2026-05-19)

### Added
- 5 nuevas secciones en `pm-navigator`: Stakeholders, Riesgos, Usabilidad, Valor de negocio, Metricas
- 2 nuevos templates: `templates/usabilidad.md` y `templates/presentacion-ejecutiva.md`
- ~25 nuevas variables en el JSON plano (total ~70)
- Ejemplo completo en `proyectos/ejemplo/` con los 2 nuevos documentos

### Changed
- `pm-navigator.md`: de 6 a 11 secciones de entrevista (~70 preguntas)
- `docs-creator.md`: mapping actualizado con 7 templates
- `README.md`: documentacion actualizada a v1.3.0

## v1.2.0 (2026-05-19)

### Added
- Preguntas detalladas mapeadas 1:1 a variables de templates
- Generacion de slug desde nombre_proyecto
- Flujo condicional nuevo/existente en pm-navigator
- JSON plano unico compartido entre todos los agentes

### Changed
- `proyecto-nuevo.md`: output plano en vez de arrays anidados
- `proyecto-existente.md`: ahora lee docs existentes y reporta gaps
- `docs-creator.md`: usa slug, write crea carpetas automaticamente

### Fixed
- Proyectos existentes ya no sobrescriben documentacion (pregunta "crear o actualizar?")
- Formato inconsistente entre proyecto-nuevo y docs-creator resuelto con JSON plano

## v1.1.0 (2026-05-19)

### Added
- `agent-logs.md`: registro automatico en changelog.md del proyecto
- Bloque `===DATOS DEL PROYECTO===` para paso de estado entre agentes

### Changed
- `docs-creator.md`: validacion de variables, max 1 repregunta, asigna `<!-- TODO -->`
- `docs-updater.md`: solo `edit`, nunca `write`, anclaje por headers Markdown

## v1.0.0 (2026-05-19)

### Added
- Primeros 5 agentes: pm-navigator, proyecto-nuevo, proyecto-existente, docs-creator, docs-updater
- 5 templates: product-vision, funcionales, no-funcionales, backlog, sprint-plan
- Proyecto ejemplo con datos de "Sistema de Pedidos Online"
- Sin dependencias externas (Python, Tesseract, ffmpeg, etc.)

## 2026-05-19 12:00

**Accion:** creacion
**Agente:** pm-navigator + docs-creator
**Proyecto:** Desarrollos (slug: desarrollos)
**Sprint:** 1 (20-may-2026 al 20-jun-2026)
**Equipo:** 1 Backend, 1 Frontend, 1 QA
**Archivos creados (7):**
- `proyectos/desarrollos/docs/product-vision.md`
- `proyectos/desarrollos/docs/requerimientos/funcionales.md`
- `proyectos/desarrollos/docs/requerimientos/no-funcionales.md`
- `proyectos/desarrollos/docs/backlog/backlog.md`
- `proyectos/desarrollos/docs/backlog/sprint-plan.md`
- `proyectos/desarrollos/docs/usabilidad.md`
- `proyectos/desarrollos/docs/presentacion-ejecutiva.md`
**Descripcion:** Creacion de documentacion completa para nuevo proyecto "Desarrollos". Se generaron los 7 documentos base del proyecto, cubriendo vision de producto, requerimientos funcionales y no funcionales, backlog, planificacion del sprint 1, usabilidad y presentacion ejecutiva. Equipo conformado por 1 Backend, 1 Frontend y 1 QA.
