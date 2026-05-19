---
titulo: "Sistema de gestion - Producto & Tecnología"
version: 0.1
fecha: 2026-05-19
estado: borrador
tipo: nuevo
---
# Vision del Producto: Sistema de gestion - Producto & Tecnología

## Problema
La recepción de requerimientos desde otras direcciones hacia el área de Producto & Tecnología carece de un canal unificado, estructurado y estandarizado. Esto genera falta de gobernanza, falta de categorización (no se diferencian solicitudes estratégicas de operativas) y desconexión en el ciclo de vida entre la aprobación y la ejecución.

## Solucion propuesta
Plataforma modular en dos fases: Fase 1 - Panel de Solicitudes Interdepartamentales (interfaz externa para que directores envíen solicitudes estandarizadas bajo tipologías) y Fase 2 - Panel de Distribución Interna y Ejecución (panel de control interno para transformar solicitudes aprobadas en proyectos con asignación de colaboradores).

## Objetivos del negocio
Optimizar Time-to-Market, eficiencia operativa reduciendo tiempo administrativo de dirección, trazabilidad y visibilidad del estado de requerimientos (Recibido → Evaluado → Asignado → En Desarrollo).

## Publico objetivo
Usuarios Externos: Directores de otros departamentos (solicitantes). Usuario Administrador Principal: Directora de Producto & Tecnología (aprobador). Usuarios Internos: Colaboradores y equipos técnicos de la Mesa (ejecutores).

## Criterios de exito
Centralización del 100% de solicitudes interdepartamentales en primer mes. Reducción en tiempo de procesamiento y asignación interna. Satisfacción de directores solicitantes gracias a claridad en el estado de sus pedidos.

## Tecnologia sugerida
Frontend: React 19 + TypeScript + Vite + TailwindCSS. Backend: Node.js 22 + NestJS + TypeScript. Base de datos: PostgreSQL 16. ORM: Prisma. Autenticación: JWT + RBAC. Almacenamiento: AWS S3 (archivos adjuntos). Notificaciones: nodemailer + AWS SES. CI/CD: GitHub Actions. Hosting: AWS ECS / Vercel (Frontend) + Railway o AWS EC2 (Backend). Metodología: REST API documentada con Swagger/OpenAPI.

## Diagramas

### Diagrama de flujo del ciclo de vida de una solicitud

```mermaid
graph TD
    A[Solicitante] -->|Envía solicitud| B[Recibido]
    B --> C{Directora evalúa}
    C -->|Aprueba| D[Aprobado]
    C -->|Rechaza| E[Rechazado]
    D --> F[Asignado a equipo]
    F --> G[En Desarrollo]
    G --> H[Completado]
    E --> I[Feedback al solicitante]
    style A fill:#e1f5fe,stroke:#0288d1
    style B fill:#fff3e0,stroke:#f57c00
    style C fill:#fff8e1,stroke:#fbc02d
    style D fill:#e8f5e9,stroke:#388e3c
    style E fill:#fbe9e7,stroke:#d32f2f
    style F fill:#e8f5e9,stroke:#388e3c
    style G fill:#e3f2fd,stroke:#1976d2
    style H fill:#e8f5e9,stroke:#2e7d32
    style I fill:#fce4ec,stroke:#c62828
```

### Diagrama de arquitectura de componentes

```mermaid
graph TD
    subgraph Frontend
        FE[React 19 + Vite + TailwindCSS]
        FE1[Portal de Solicitudes]
        FE2[Panel de Triage]
        FE3[Panel Interno]
    end
    subgraph Backend
        BE[NestJS + TypeScript]
        API[REST API - Swagger/OpenAPI]
        AUTH[Módulo de Autenticación JWT + RBAC]
        NOTIF[Módulo de Notificaciones - nodemailer/SES]
    end
    subgraph Almacenamiento
        DB[(PostgreSQL 16 - Prisma ORM)]
        S3[AWS S3 - Archivos adjuntos]
        REDIS[(Redis - Cache opcional)]
    end
    subgraph CI/CD
        GHA[GitHub Actions]
        DEPLOY[Vercel / AWS ECS / Railway]
    end
    FE1 -->|HTTP/HTTPS| API
    FE2 -->|HTTP/HTTPS| API
    FE3 -->|HTTP/HTTPS| API
    API --> AUTH
    API --> NOTIF
    API --> DB
    API --> S3
    API -.-> REDIS
    GHA --> DEPLOY
```

### Diagrama de roles y permisos (RBAC)

```mermaid
graph TD
    subgraph Roles del Sistema
        SOL[Solicitante<br/>Director de otra área]
        DIR[Directora<br/>Producto & Tecnología]
        COO[Coordinador<br/>PM / Tech Lead]
        COL[Colaborador<br/>UX, Dev, QA]
    end
    subgraph Permisos
        P1[Crear solicitudes]
        P2[Consultar estado]
        P3[Aprobar / Rechazar]
        P4[Crear instancias de trabajo]
        P5[Asignar colaboradores]
        P6[Gestionar tareas]
        P7[Actualizar estado de tareas]
        P8[Ver tablero completo]
    end
    SOL --> P1
    SOL --> P2
    DIR --> P3
    DIR --> P4
    DIR --> P5
    DIR --> P8
    COO --> P5
    COO --> P6
    COO --> P8
    COL --> P7
    COL --> P2
```
