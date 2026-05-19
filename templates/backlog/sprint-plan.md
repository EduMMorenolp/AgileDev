---
proyecto: "{{nombre_proyecto}}"
sprint: {{sprint_numero}}
duracion: {{sprint_duracion}}
fecha_inicio: {{fecha_inicio}}
fecha_fin: {{fecha_fin}}
estado: planificado
---
# Sprint {{sprint_numero}}: {{sprint_goal}}

## Equipo
{{equipo}}

## Items del Sprint

| Historia | Tareas | Responsable | Estado |
|----------|--------|-------------|--------|
| {{historia_1}} | {{tareas_1}} | {{responsable_1}} | Pendiente |
| {{historia_2}} | {{tareas_2}} | {{responsable_2}} | Pendiente |

## Definition of Done
- Codigo completado y revisado
- Pruebas unitarias pasan
- Documentacion actualizada
- Despliegue en entorno de pruebas

## Diagramas

{{mermaid_diagrams}}
