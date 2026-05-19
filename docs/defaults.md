# Defaults entre proyectos

## _defaults.json

Para evitar repetir datos en cada proyecto (stakeholders, equipo, tecnologia),
crea el archivo `proyectos/_defaults.json` con los valores que se repiten:

```json
{
  "stakeholders_lista": "Gerente de Operaciones, Clientes, Equipo deposito",
  "equipo": "1 Tech Lead, 2 Devs, 1 QA",
  "tecnologia": "React + Node.js + PostgreSQL + AWS",
  "sprint_1_duracion": "2 semanas",
  "comunicacion_frecuencia": "Semanal"
}
```

El navigador lo lee al iniciar y pregunta:
- `todo` → carga todos los defaults y salta esas secciones
- `[secciones]` → carga solo las indicadas
- `no` → ignora defaults, pregunta todo

## _variables.json (snapshot automatico)

Cada vez que `@docs-creator` genera la documentacion, tambien escribe
`proyectos/[slug]/_variables.json` con el snapshot completo de todas las
variables recolectadas.

**Para reusarlo en el proximo proyecto:**

```bash
cp proyectos/proyecto-anterior/_variables.json proyectos/_defaults.json
```

El proximo proyecto que inicies detectara esos valores y ofrecera cargarlos.
