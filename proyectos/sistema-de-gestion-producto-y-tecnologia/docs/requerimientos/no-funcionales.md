---
modulo: "Sistema de gestion - Producto & Tecnología"
tipo: no-funcionales
version: 0.1
fecha: 2026-05-19
---
# Requerimientos No Funcionales: Sistema de gestion - Producto & Tecnología

## Rendimiento
Tiempo de carga de página < 2s (Lighthouse). Respuesta API (p95) < 500ms para endpoints críticos. Soportar 50+ solicitudes concurrentes y 200+ usuarios registrados. Lazy loading en listados con paginación (offset/limit). Compresión gzip/brotli en respuestas. Cacheo de consultas frecuentes con Redis (opcional en Fase 2). Límite de adjuntos: 10MB por archivo, validación en frontend y backend.

## Seguridad
Autenticación JWT con refresh tokens y expiración. RBAC con 4 roles (Solicitante, Directora, Coordinador, Colaborador). HTTPS obligatorio en todos los entornos. Validación estricta de tipos de archivo (solo PDF/PNG/JPG). Protección CSRF con tokens y cookies SameSite. Rate limiting por IP y por usuario (100 req/min). Sanitización de inputs (XSS prevention). Logs de auditoría (tabla con timestamp, usuario, acción, detalle). Cifrado en tránsito (TLS 1.3) y en reposo (AES-256 en BD).

## Usabilidad
La usabilidad del sistema se compone de los siguientes aspectos:

**Nivel de usabilidad esperado:** Alto: curva de aprendizaje <2 min primer uso, SUS >80/100, formularios tipificados con validación, interfaz tipo Kanban para evitar sobrecarga cognitiva.

**Requisitos de accesibilidad:** No contemplado en MVP. Post-MVP: contraste mínimo 4.5:1, navegación por teclado, etiquetas aria-label en formularios.

**Dispositivos objetivo:** Desktop/Laptop - resoluciones desde 1280px (90% del uso esperado).

**Idiomas soportados:** Español (post-MVP: internacionalización i18n con soporte Inglés).

## Compatibilidad
Desktop/Laptop exclusivamente. Navegadores: Chrome 120+, Firefox 115+, Edge 120+, Safari 16+ (últimas 2 versiones estables). Resolución mínima: 1280x720. Sin soporte responsive mobile ni tablet. Pruebas cross-browser automatizadas en CI.

## Mantenibilidad
Arquitectura modular por capas (Presentation → Application → Domain → Infrastructure). Tests unitarios con Jest (cobertura > 80%). Tests E2E con Playwright para flujos críticos (login, carga, aprobación). ESLint + Prettier + Husky + lint-staged (formateo automático pre-commit). Conventional Commits + Semantic Release. Documentación técnica: README con instrucciones de setup, Swagger para API, ADR para decisiones arquitectónicas. CI/CD con GitHub Actions (lint → test → build → deploy). Dependencias actualizadas periódicamente con Dependabot.
