---
sprint: Sprint 1
proyecto: "Sistema de gestion - Producto & Tecnología"
duracion: 2 semanas
fecha: 2026-05-19
---
# Task Cards: Sistema de gestion - Producto & Tecnología — Sprint Sprint 1

## Equipo del Sprint
1 Frontend, 1 Backend, 1 QA, 1 Diseñador UX/UI

### TL / Coordinación
- Supervisión técnica general del sprint
- Revisión de diseño de arquitectura y wireframes
- Coordinación de entregas entre Frontend, Backend, UX y QA
- Validación de que el setup del proyecto cumple estándares

### Desarrollo (Frontend + Backend)
**Frontend:**
- Setup del proyecto React + Vite + TypeScript + TailwindCSS
- Layout base y estructura de componentes
- Componentes de formulario estandarizado con categorías
- Implementación de formulario con categorías visuales, carga de archivos y validación

**Backend:**
- Modelo de datos: entidades Usuario, Solicitud, Estado, Tipología
- Seed de roles (Solicitante, Directora, Coordinador, Colaborador) y tipologías
- Endpoints CRUD de solicitudes
- Integración AWS S3 para carga y gestión de archivos adjuntos

### QA / Testing
- Plan de pruebas del sistema
- Definición de casos de uso críticos (envío, validación, archivos)
- Pruebas funcionales de envío de solicitud
- Pruebas de validación de campos obligatorios
- Pruebas de subida de archivos (PDF/PNG/JPG, límite 10MB)

### PO / Product Owner
- Definición y validación de criterios de aceptación por historia de usuario
- Validación de que los flujos cumplen con la visión del producto
- Revisión de wireframes y prototipos UX/UI
- Priorización de tareas y ajuste de backlog según feedback

## Definition of Done
- [ ] Codigo completado y revisado por par
- [ ] Pruebas unitarias pasan (cobertura > 80%)
- [ ] Documentacion actualizada
- [ ] Despliegue en entorno de pruebas
