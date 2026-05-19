# Flujo de uso

## Paso a paso

1. Abre opencode y presiona **Tab** hasta `pm-navigator`
2. Di "hola" o "tengo un proyecto"
3. El navigador lee `proyectos/_defaults.json` si existe:
   - "Encontre valores guardados para [secciones]. Los uso?"
   - `todo` → precarga todo, salta las secciones con defaults
   - `[seccion A, seccion C]` → precarga solo esas
   - `no` → ignora defaults, pregunta todo
4. Realiza ~12 preguntas abiertas en lenguaje natural.
   De cada respuesta extrae multiples variables
5. Construye JSON plano con ~120 variables
6. Genera slug del nombre del proyecto

## Proyecto Nuevo

```
pm-navigator (entrevista)
  → @proyecto-nuevo (valida prioridades, MVP, roadmap)
  → fusion de JSONs
  → @docs-creator (genera 12 archivos + diagramas + task cards + _variables.json)
  → @docs-validator (revisa calidad)
  → @agent-logs (registra en changelog.md)
```

## Proyecto Existente

```
pm-navigator (entrevista)
  → @proyecto-existente (lee docs, detecta gaps)
  → decision del usuario: CREAR o ACTUALIZAR
  → si CREAR: @docs-creator (sobrescribe todo)
  → si ACTUALIZAR: @docs-updater (completa lo que falta)
  → @agent-logs
```

## Manejo de estado entre agentes

El `pm-navigator` pasa los datos mediante un bloque JSON plano inline
dentro del prompt del Task tool:

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
(sin arrays anidados), permitiendo a `docs-creator` reemplazar
directamente `{{variable}}` → valor.
