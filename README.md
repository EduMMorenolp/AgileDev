# AgileDev Suite v1.3.0

Sistema CASE para la gestion integrada de preparacion de proyectos de software basado en Scrum, Ingenieria de Requerimientos y Control de Configuracion.

## Arquitectura de Agentes

### pm-navigator (Primary - Tab)
Orquestador principal. Realiza **entrevista detallada** que recolecta todas las variables de los templates (45+ preguntas mapeadas 1:1), construye un JSON plano, genera un slug del nombre del proyecto y coordina a los subagentes segun el tipo de proyecto.

**Permisos:** read + task (sin edit ni bash)

### Subagentes

| Agente | Funcion | Permisos |
|--------|---------|----------|
| `@proyecto-nuevo` | Valida prioridades, completa MVP/roadmap, devuelve JSON plano | read + edit |
| `@proyecto-existente` | Lee docs actuales, detecta gaps, recomienda crear o actualizar | read + edit |
| `@docs-creator` | Lee templates, reemplaza `{{variable}}` 1:1 con JSON plano, escribe en `proyectos/[slug]/docs/` | read + edit |
| `@docs-updater` | Modifica docs existentes usando SOLO `edit` por anclas Markdown. Nunca `write`. | read + edit |
| `@agent-logs` | Registra cada accion en `changelog.md` del proyecto | read + edit |

## Changelog

Las novedades de cada version se registran en [CHANGELOG.md](CHANGELOG.md).

## Estructura del proyecto

```
Proyectos/AgileDev/
├── opencode.json
├── README.md
├── .opencode/agents/
│   ├── pm-navigator.md
│   ├── proyecto-nuevo.md
│   ├── proyecto-existente.md
│   ├── docs-creator.md
│   ├── docs-updater.md
│   └── agent-logs.md
├── templates/
│   ├── product-vision.md
│   ├── usabilidad.md
│   ├── presentacion-ejecutiva.md
│   ├── requerimientos/
│   │   ├── funcionales.md
│   │   └── no-funcionales.md
│   └── backlog/
│       ├── backlog.md
│       └── sprint-plan.md
└── proyectos/
    └── ejemplo/
        ├── changelog.md
        └── docs/
            ├── product-vision.md
            ├── usabilidad.md
            ├── presentacion-ejecutiva.md
            ├── requerimientos/
            │   ├── funcionales.md
            │   └── no-funcionales.md
            └── backlog/
                ├── backlog.md
                └── sprint-plan.md
```

## Flujo de uso

1. Abre opencode y presiona **Tab** hasta `pm-navigator`
2. Di "hola" o "tengo un proyecto"
3. El navigador realiza la entrevista completa (11 secciones, ~70 preguntas)
4. Al completar, construye un **JSON plano** con todas las variables
5. Genera un **slug** del nombre del proyecto (ej: "Mi Proyecto" → "mi-proyecto")
6. Flujo segun tipo:

   **NUEVO:**
   - Invoca `@proyecto-nuevo` para validar prioridades y completar MVP/roadmap
   - Fusiona ambos JSON
   - Invoca `@docs-creator` para generar los 5 archivos desde templates
   - Invoca `@agent-logs`

   **EXISTENTE:**
   - Invoca `@proyecto-existente` para analizar que docs ya existen
   - Pregunta al usuario: "Crear desde cero o actualizar?"
   - Si "crear" → `@docs-creator` (sobrescribe)
   - Si "actualizar" → `@docs-updater` (completa lo que falta)
   - Invoca `@agent-logs`

7. Los documentos quedan en `proyectos/[slug]/docs/`

## Manejo de estado entre agentes

El `pm-navigator` pasa los datos a cada subagente mediante un bloque **JSON plano**
inline dentro del prompt del Task tool. El JSON contiene las MISMA CLAVES que los
marcadores `{{variable}}` de los templates:

```
===DATOS DEL PROYECTO===
```json
{
  "nombre_proyecto": "Sistema de Pedidos Online",
  "slug": "sistema-de-pedidos-online",
  "problema_descripcion": "...",
  "solucion_descripcion": "...",
  "epica_1_nombre": "Catalogo",
  ...
}
```
===FIN DATOS===
```

Los subagentes leen este bloque al inicio. Todas las claves son planas
(sin arrays anidados), lo que permite a `docs-creator` reemplazar
directamente `{{variable}}` → valor.

## Flujo detallado por tipo de proyecto

### Proyecto Nuevo
```
pm-navigator (entrevista)
  → JSON plano con 45+ variables
  → @proyecto-nuevo (valida prioridades, sugiere MVP/roadmap)
  → fusion de JSONs
  → @docs-creator (crea 5 archivos desde templates)
  → @agent-logs (registra en changelog.md)
```

### Proyecto Existente
```
pm-navigator (entrevista)
  → JSON plano
  → @proyecto-existente (lee docs, detecta gaps)
  → decision del usuario: CREAR o ACTUALIZAR
  → si CREAR: @docs-creator (sobrescribe todo)
  → si ACTUALIZAR: @docs-updater (completa lo que falta)
  → @agent-logs
```

## Variables de templates

Las 7 plantillas usan ~70 marcadores `{{variable}}`. El navigator pregunta
por cada una de forma explicita durante la entrevista. Las variables se
agrupan en 11 secciones:

| Seccion | Variables | Template destino |
|---------|-----------|-----------------|
| Info basica | nombre_proyecto, tipo, fecha | todos |
| Vision | problema_descripcion, solucion_descripcion, objetivos, publico_objetivo, criterios_exito | product-vision.md |
| Tecnologia | tecnologia, rendimiento, seguridad, usabilidad, compatibilidad, mantenibilidad | product-vision.md, no-funcionales.md |
| Stakeholders | stakeholders_lista, poder_interes, comunicacion_frecuencia, comunicacion_canal, decisor_presupuesto, aprobador_cambios | presentacion-ejecutiva.md |
| Epicas | epica_1/2/3_nombre, _desc, _prioridad, _deps, mvp_descripcion, roadmap | funcionales.md |
| Historias | historia_1/2/3, sp_1/2/3, ca_1/2/3 | backlog.md |
| Riesgos | riesgo_mercado, riesgo_legal, riesgo_adopcion, riesgo_dependencia | presentacion-ejecutiva.md |
| Sprint | sprint_numero, duracion, goal, equipo, fechas, tareas, responsables | sprint-plan.md |
| Usabilidad | perfil_usuarios_detalle, necesidades_accesibilidad, nivel_usabilidad, dispositivos_objetivo, idiomas | usabilidad.md |
| Valor negocio | pitch_ejecutivo, justificacion_negocio, roi, competidores, foda, peor_escenario, cronograma_hitos, equipo_requerido | presentacion-ejecutiva.md |
| Metricas | kpi_principales, kpi_tecnicos, kpi_negocio | product-vision.md, presentacion-ejecutiva.md |

## Validacion de variables

`@docs-creator` aplica esta politica:
1. Reemplaza cada `{{variable}}` con el valor del JSON plano
2. Si una variable falta o esta vacia, **repregunta al usuario UNA SOLA vez**
3. Si el usuario no clarifica, asigna `<!-- TODO: Pendiente de definir -->`
4. Nunca deja un marcador `{{variable}}` literal en el archivo final

## Idempotencia en @docs-updater

- Usa SIEMPRE la herramienta `edit` (reemplazo exacto por bloques)
- NUNCA usa `write` para modificar un archivo existente
- Busca **anclas** (headers `##` o `###`) para localizar bloques
- Si no encuentra el texto exacto, busca el header de seccion mas cercano
- Si no encuentra ni header, ABORTA y reporta el conflicto

## Control de Cambios (agent-logs)

Cada vez que se crea o modifica documentacion, `@agent-logs` escribe o
actualiza `proyectos/[slug]/changelog.md` con:

- Fecha y hora
- Accion (creacion / modificacion)
- Agente que lo solicito
- Archivos afectados
- Descripcion del cambio

## Personalizacion

- Las plantillas en `templates/` pueden modificarse libremente
- Si agregas/quitas marcadores `{{variable}}` en templates, actualiza las
  preguntas de `pm-navigator.md` para mantener la consistencia
- Las variables deben coincidir exactamente entre el JSON del navigator,
  los templates y los subagentes

## Requisitos

- OpenCode (version reciente)
- Ninguna dependencia externa (Python, Tesseract, ffmpeg, etc.)

## Licencia

MIT
