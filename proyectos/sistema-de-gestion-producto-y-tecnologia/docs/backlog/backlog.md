---
proyecto: "Sistema de gestion - Producto & Tecnología"
version: 0.1
fecha: 2026-05-19
---
# Product Backlog: Sistema de gestion - Producto & Tecnología

| Prioridad | Historia de Usuario | Epic | Story Points | Criterios de Aceptacion |
|-----------|--------------------|------|--------------|------------------------|
| Must | Como Director Solicitante, quiero seleccionar una categoría visual mediante tarjetas y completar un formulario estandarizado, para enviar una solicitud clara y formal a la mesa de Producto & Tecnología sin usar canales informales. | F01: Portal de Carga y Clasificación de Solicitudes | 5 | Escenario 1: Envío exitoso - guarda solicitud como Pendiente con ID único. Escenario 2: Validación - bloquea envío si campos obligatorios vacíos. Escenario 3: Archivos adjuntos - valida PDF/PNG/JPG hasta 10MB. |
| Should | Como Directora de Producto & Tecnología, quiero visualizar el listado de solicitudes pendientes y tener la opción de aprobarlas o rechazarlas, para controlar estratégicamente el ingreso de requerimientos a mi área. | F02: Módulo de Triage y Gobernanza Directiva | 5 | Escenario 1: Aprobación - cambia estado a Aprobada. Escenario 2: Rechazo con feedback obligatorio - cambia a Rechazada. Escenario 3: Notificación automática por email al solicitante. |
| Could | Como Directora o Coordinador de la mesa, quiero tomar una solicitud aprobada para estructurarla como proyecto y asignar colaboradores de la mesa, para iniciar la ejecución formal del trabajo. | F03: Panel Interno de Asignación y Distribución Operativa | 8 | Escenario 1: Restricción por rol (403 a solicitantes). Escenario 2: Creación de instancia de trabajo con fecha de entrega. Escenario 3: Asignación por perfiles técnicos (UX, Front, Back, QA). |
