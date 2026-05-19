# Templates y variables

## Plantillas disponibles

| Template | Salida en proyecto |
|----------|-------------------|
| `templates/product-vision.md` | `docs/product-vision.md` |
| `templates/requerimientos/funcionales.md` | `docs/requerimientos/funcionales.md` |
| `templates/requerimientos/no-funcionales.md` | `docs/requerimientos/no-funcionales.md` |
| `templates/backlog/backlog.md` | `docs/backlog/backlog.md` |
| `templates/backlog/sprint-plan.md` | `docs/backlog/sprint-plan.md` |
| `templates/usabilidad.md` | `docs/usabilidad.md` |
| `templates/presentacion-ejecutiva.md` | `docs/presentacion-ejecutiva.md` |
| `templates/task-cards.md` | `docs/task-cards.md` |
| `templates/roadmap-sprints.md` | `docs/roadmap-sprints.md` |
| `templates/acta-reunion.md` | `docs/acta-reunion.md` |
| `templates/retrospectiva.md` | `docs/retrospectiva.md` |
| `templates/glosario.md` | `docs/glosario.md` |

## Variables por seccion

| Seccion | Variables | Template |
|---------|-----------|----------|
| Info basica | nombre_proyecto, tipo, fecha | todos |
| Vision | problema_descripcion, solucion_descripcion, objetivos, publico_objetivo, criterios_exito | product-vision.md |
| Tecnologia | tecnologia, rendimiento, seguridad, usabilidad, compatibilidad, mantenibilidad | product-vision.md, no-funcionales.md |
| Stakeholders | stakeholders_lista, poder_interes, comunicacion_frecuencia, comunicacion_canal, decisor_presupuesto, aprobador_cambios | presentacion-ejecutiva.md |
| Epicas | epica_1/2/3_nombre, _desc, _prioridad, _deps, mvp_descripcion, roadmap | funcionales.md |
| Historias | historia_1/2/3, sp_1/2/3, ca_1/2/3 | backlog.md |
| Riesgos | riesgo_mercado, riesgo_legal, riesgo_adopcion, riesgo_dependencia | presentacion-ejecutiva.md |
| Sprint (x6) | sprint_count, sprint_1/2/3/4/5/6_goal, _duracion, _inicio, _fin | sprint-plan.md, task-cards.md, roadmap-sprints.md |
| Usabilidad | perfil_usuarios_detalle, necesidades_accesibilidad, nivel_usabilidad, dispositivos_objetivo, idiomas | usabilidad.md |
| Valor negocio | pitch_ejecutivo, justificacion_negocio, roi, competidores, foda, peor_escenario, cronograma_hitos, equipo_requerido | presentacion-ejecutiva.md |
| Metricas | kpi_principales, kpi_tecnicos, kpi_negocio | product-vision.md, presentacion-ejecutiva.md |

## Templates sin preguntas

Estos se crean con datos generados o vacios, y se completan durante la ejecucion:

| Template | Variables | Nota |
|----------|-----------|------|
| task-cards.md | tl_tareas, dev_tareas, qa_tareas, po_tareas | Derivadas por docs-creator desde datos del sprint |
| acta-reunion.md | acta_asistentes, acta_proposito, acta_temas, acta_decisiones, acta_acciones | Se completa durante el proyecto |
| retrospectiva.md | retro_bien, retro_mejorar, retro_acciones, retro_velocidad | Se completa post-sprint |
| glosario.md | glosario_termino_1/5, glosario_definicion_1/5 | Se completa durante el proyecto |

## Diagramas Mermaid.js

Los templates incluyen `{{mermaid_diagrams}}` que docs-creator reemplaza
con diagramas generados automaticamente:

- **Gantt**: cronograma de sprints
- **QuadrantChart**: matriz poder-interes de stakeholders
- **Flowchart**: dependencias entre epicas
- **Timeline**: roadmaps del producto

Los diagramas se renderizan en GitHub, GitLab y otros visores Markdown.

## Multi-sprint

Soporte para hasta 6 sprints por proyecto:
- `sprint_count`: total de sprints
- `sprint_1_*`: variables detalladas (goal, duracion, fechas, tareas, equipo)
- `sprint_2/3/4/5/6_*`: goal, duracion, inicio, fin
- `roadmap-sprints.md`: tabla resumen + diagrama Gantt
