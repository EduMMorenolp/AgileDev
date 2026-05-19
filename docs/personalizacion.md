# Personalizacion

## Templates

Las plantillas en `templates/` pueden modificarse libremente.
Si agregas o quitas marcadores `{{variable}}`, actualiza tambien
`pm-navigator.md` para que la entrevista los recolecte.

Las variables deben coincidir exactamente entre:
- El JSON que construye `pm-navigator`
- Los marcadores en los templates
- Los prompts de los subagentes

## docs-creator

Politica de validacion de variables:
1. Reemplaza cada `{{variable}}` con el valor del JSON plano
2. Si una variable falta o esta vacia, **repregunta al usuario UNA SOLA vez**
3. Si el usuario no clarifica, asigna `<!-- TODO: Pendiente de definir -->`
4. Nunca deja un marcador `{{variable}}` literal en el archivo final

## Requisitos

- OpenCode (version reciente)
- Ninguna dependencia externa (Python, Tesseract, ffmpeg, etc.)

## Licencia

MIT
