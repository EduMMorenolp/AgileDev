# AgileDev Suite v2.1.0

Sistema CASE para preparacion de proyectos de software basado en Scrum,
Ingenieria de Requerimientos y Control de Configuracion.

## Arquitectura

| Agente | Rol | Permisos |
|--------|-----|----------|
| `@pm-navigator` (primary) | Entrevista en ~12 preguntas, construye JSON plano, orquesta | read + task |
| `@proyecto-nuevo` | Valida prioridades y completa MVP/roadmap | read + edit |
| `@proyecto-existente` | Analiza docs existentes, detecta gaps | read + edit |
| `@docs-creator` | Genera docs desde templates, Mermaid, task cards, `_variables.json` | read + edit |
| `@docs-updater` | Modifica docs existentes solo con `edit` | read + edit |
| `@docs-validator` | Revisa ortografia, consistencia, TODOs | read + edit |
| `@agent-logs` | Registra cambios en `changelog.md` | read + edit |

## Estructura

```
Proyectos/AgileDev/
├── opencode.json
├── README.md
├── CHANGELOG.md
├── .opencode/agents/     (7 agentes)
├── templates/             (12 plantillas)
└── proyectos/
    ├── _defaults.json     (valores reutilizables)
    └── ejemplo/           (proyecto de referencia)
```

## Quick start

```
1. Tab → @pm-navigator
2. Dice "hola" → inicia entrevista (~12 preguntas)
3. Completa → genera docs en proyectos/[slug]/docs/
```

## Desarrollo Frontend + Docker

Para editar el frontend sin reconstruir la imagen en cada cambio:

```
# 1) Levanta backend/API en Docker
docker-compose up -d agiledev

# 2) En otra terminal, levanta Vite
cd frontend
npm run dev
```

Abre `http://localhost:5173` para desarrollo.

En modo `dev`, Vite ahora hace proxy de:
- `/api` -> `http://localhost:4097`
- `/docs` -> `http://localhost:4097`

Asi mantienes el backend en Docker y tienes hot reload inmediato en frontend.

## Documentacion

| Archivo | Contenido |
|---------|-----------|
| [docs/agentes.md](docs/agentes.md) | Descripcion detallada de cada agente |
| [docs/flujo.md](docs/flujo.md) | Flujo de uso, estado entre agentes, nuevo vs existente |
| [docs/templates.md](docs/templates.md) | Plantillas, variables, Mermaid, multi-sprint |
| [docs/defaults.md](docs/defaults.md) | `_defaults.json` y snapshot `_variables.json` |
| [docs/personalizacion.md](docs/personalizacion.md) | Personalizacion, requisitos, licencia |
| [CHANGELOG.md](CHANGELOG.md) | Historial de versiones |
