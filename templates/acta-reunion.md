---
proyecto: "{{nombre_proyecto}}"
tipo: acta
fecha: {{fecha}}
---
# Acta de Reunion: {{nombre_proyecto}}

## Datos de la reunion

| Campo | Detalle |
|-------|---------|
| Fecha | {{fecha}} |
| Asistentes | {{acta_asistentes}} |
| Proposito | {{acta_proposito}} |

## Temas tratados
{{acta_temas}}

## Decisiones tomadas
{{acta_decisiones}}

## Acciones pendientes
{{acta_acciones}}

| # | Accion | Responsable | Fecha limite |
|---|--------|-------------|--------------|
| 1 | {{acta_accion_1}} | {{acta_responsable_1}} | {{acta_fecha_1}} |
| 2 | {{acta_accion_2}} | {{acta_responsable_2}} | {{acta_fecha_2}} |

## Proxima reunion
{{acta_proxima_reunion}}
