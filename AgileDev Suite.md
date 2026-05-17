## **Propuesta de Software: AgileDev Suite**

*Sistema CASE para la Gestión Integrada del Desarrollo de Software basado en Scrum, Ingeniería de Requerimientos y Control de Configuración*

### **1\. Objetivos Generales**

* Proveer una plataforma unificada que automatice las prácticas de ingeniería de software definidas en los documentos (Procesos de negocio, contables, paradigmas organizacionales, TGS, gestión de requerimientos, metodologías ágiles y configuración).  
* Aplicar el marco de trabajo Scrum 2020 (eventos, artefactos, roles) junto con técnicas de especificación de requerimientos (historias de usuario, INVEST, SMART, FURPS+ / ISO 25010).  
* Garantizar la integridad del producto mediante administración de configuración (identificación de ítems, líneas base, control de cambios, auditorías) y rastreabilidad bidireccional.  
* Facilitar la colaboración interdisciplinaria (analistas, desarrolladores, testers, product owner, scrum master, stakeholders) y la toma de decisiones con métricas empíricas.

### **2\. Arquitectura Funcional (Capas de la Ingeniería de Software)**

Sobre una base de gestión de calidad y control interno (separación de funciones, niveles de autorización, integridad de la información), el sistema se estructura en cuatro capas:

| Capa | Componentes |
| ----- | ----- |
| Proceso (Marco de trabajo) | Scrum (Sprints, eventos, artefactos) \+ PM4U (composición, descomposición, riesgos) |
| Métodos técnicos | Elicitación (entrevistas, encuestas, observación), especificación (historias de usuario, criterios SMART), análisis y diseño, pruebas, despliegue |
| Herramientas CASE | Módulos integrados: Gestión Ágil, Requerimientos y Rastreabilidad, Control de Configuración, Control de Cambios |
| Soporte | Disciplinas de gestión (planificación, monitoreo), aseguramiento de calidad, métricas, gestión de configuración |

### **3\. Módulos Detallados del Software**

#### Módulo 1: Gestión Ágil (Backlog y Sprints)

* Product Backlog dinámico con elementos (historias de usuario, épicas, tareas). Cada elemento permite:  
  * Asignar prioridad (MoSCoW o valor de negocio).  
  * Estimar tamaño mediante Planning Poker virtual: los desarrolladores votan con la secuencia de Fibonacci (1,2,3,5,8…), cartas ocultas, discusión de extremos y consenso.  
  * Vincular a objetivo del producto (meta a largo plazo) y a versiones/releases.  
* Sprint Planning asistida: selección de ítems del backlog, definición del Sprint Goal, descomposición en tareas (regla 8/80). Timebox automático (máx 8h para Sprint de 1 mes).  
* Daily Scrum con tablero Kanban integrado (To Do, In Progress, Done) y registro automático de impedimentos.  
* Sprint Review: espacio para presentar el Incremento a stakeholders, capturar feedback y ajustar el backlog.  
* Sprint Retrospective: plantillas para análisis de qué funcionó bien, qué problemas, plan de acción de mejora continua (adaptación).

#### Módulo 2: Administración de Requerimientos y Rastreabilidad

* Captura de requerimientos:  
  * Formularios para historias de usuario (formato: *“Como \[rol\], quiero \[acción\] para \[beneficio\]”*). Validación de las “3 Cs” (Card, Conversation, Confirmation).  
  * Criterios de aceptación SMART (checklist editable).  
  * Atributos adicionales: origen, prioridad, estabilidad, tipo (funcional / no funcional). Para no funcionales, se ofrece categorías FURPS+ o ISO 25010 (rendimiento, usabilidad, seguridad, etc.).  
* Matriz de Rastreabilidad Automatizada:  
  * Trazabilidad vertical: necesidad de negocio → historia de usuario → tarea técnica → caso de prueba → código fuente (commit).  
  * Trazabilidad horizontal: dependencias entre historias, conflictos, duplicados.  
  * Visualización en grafo interactivo o tabla con colores para indicar consistencia (verde \= cubierto, rojo \= sin implementar, amarillo \= cambio pendiente).  
* Línea base y aprobación:  
  * Workflow de aprobación (firma digital, comentarios). Una vez aprobados, los requerimientos se congelan en una línea base (especificación o operacional). Cualquier modificación posterior requiere un cambio formal (Módulo 4).

#### Módulo 3: Control de Configuración (Repositorio Integrado)

* Repositorio centralizado (Git, Subversion o similar) que almacena ítems de configuración:  
  * Código fuente, ejecutables, scripts de BD.  
  * Documentos: plan de proyecto, especificación de requerimientos, manuales de usuario, casos de prueba, modelos de diseño (UML).  
  * Registros: actas de reuniones, informes de auditoría.  
* Versionado:  
  * Cada IC tiene historial de revisiones (evolución lineal o en árbol para variantes).  
  * Etiquetado de versiones (v1.0, v2.0) y líneas base (LB\_Req\_v1, LB\_Design\_v2).  
* Gestión de ramas (branches) para soportar variantes (por cliente, plataforma, características opcionales). Visualización gráfica del árbol de evolución.  
* Integración con herramientas de desarrollo (IDE, pipelines CI/CD) para automatizar el check-in/check-out y asociar commits a tareas o historias.

#### Módulo 4: Control de Cambios

* Portal de solicitudes de cambio (tickets) para cualquier stakeholder. Cada solicitud incluye:  
  * Descripción, justificación, impacto estimado, urgencia.  
  * Adjuntos (capturas, documentos).  
* Evaluación de impacto automática:  
  * El sistema consulta la matriz de rastreabilidad para identificar todos los ítems afectados (requerimientos relacionados, componentes de código, casos de prueba, documentos).  
  * Calcula un índice de exposición (probabilidad × impacto) y muestra alertas si hay alta criticidad.  
* Comité de Control de Cambios (CCB) virtual:  
  * Roles predefinidos (líder proyecto, arquitecto, analista, representante del cliente).  
  * Votación y aprobación/rechazo con registro de la decisión y razón.  
* Una vez aprobado, se actualiza la línea base y se notifica automáticamente a los responsables para implementar el cambio en el siguiente Sprint (o en un Sprint de emergencia si es crítico).  
* Auditorías:  
  * Auditoría de configuración física (¿lo que está documentado se construyó?).  
  * Auditoría de configuración funcional (¿el comportamiento real cumple la especificación?).  
  * Generación de informes de trazabilidad y consistencia.

#### Módulo 5: Métricas, Informes y Dashboard Ejecutivo

* Velocidad del equipo (story points completados por Sprint) – gráfico burn-down / burn-up.  
* Tiempo de ciclo y lead time de las historias.  
* Reportes de defectos (por severidad, origen, estado).  
* Control de cambios (solicitudes abiertas, tiempo de respuesta, impacto).  
* Cumplimiento de líneas base (porcentaje de ítems auditados sin desviaciones).  
* Dashboard personalizable para diferentes roles (Product Owner, Scrum Master, Gerente, Cliente).

### **4\. Ejemplo de Flujo de Trabajo (Caso “Empresa Norte”)**

1. Inicio – El Product Owner crea épicas en el Product Backlog (ej: “Gestión de pedidos de clientes”). Se usa la técnica de talleres de elicitación (entrevistas, observación directa en la fábrica de productos para bebés).  
2. Especificación – Los analistas escriben historias de usuario con criterios SMART. Ejemplo: *“Como vendedor, quiero registrar un pedido con los productos y cantidades para poder preparar el despacho”* – Criterios: “El sistema debe calcular el total en menos de 2 segundos” (requerimiento no funcional de rendimiento).  
3. Estimación – El equipo juega Planning Poker para asignar story points (ej: 5 puntos). Se define la velocidad histórica (ej: 25 puntos por Sprint).  
4. Planificación del Sprint – Se seleccionan historias por 25 puntos, se define el Sprint Goal (“Entregar el módulo de registro de pedidos con validación de stock”).  
5. Ejecución – Los desarrolladores crean ramas en el repositorio, escriben código, realizan pruebas unitarias. Las pruebas de integración y sistema se ejecutan automáticamente (CI). Se actualiza la Matriz de Rastreabilidad vinculando commits y casos de prueba.  
6. Revisión – Se muestra el Incremento al cliente. Si solicita un cambio (ej: “agregar campo de nota en el pedido”), se abre un ticket en el Módulo de Control de Cambios. El CCB evalúa impacto (afecta la historia actual, requiere modificar la BD, ajustar pruebas). Se aprueba para el próximo Sprint.  
7. Retrospectiva – El equipo identifica que las pruebas manuales toman mucho tiempo; deciden automatizar más casos. Se ajusta la Definición de Hecho.  
8. Cierre – Al final del proyecto, se genera un informe de lecciones aprendidas y se archivan todas las líneas base en el repositorio.

### **5\. Tecnologías Sugeridas (Stack Abierto)**

* Backend: Node.js \+ Express o Spring Boot (Java) – REST API.  
* Frontend: React o Angular con componentes para tableros Kanban, gráficos, matriz de rastreabilidad.  
* Base de datos: PostgreSQL (para metadatos de proyectos, usuarios, historias, solicitudes de cambio) \+ integración con repositorio Git (usando libgit2 o API de Git).  
* Repositorio de configuración: Git (GitHub Enterprise, GitLab o Bitbucket) con webhooks para sincronizar commits.  
* Herramientas de CI/CD: Jenkins o GitLab CI para ejecutar pruebas automáticas y asociar resultados a la matriz.  
* Seguridad: Autenticación OAuth2, roles (Product Owner, Scrum Master, Developer, Tester, Stakeholder), registro de auditoría.

### **6\. Beneficios Esperados**

* Reducción de errores por especificación ambigua y cambios no controlados.  
* Mayor transparencia y alineación con los objetivos de negocio gracias a la rastreabilidad.  
* Agilidad para adaptarse a cambios del entorno (soporte a procesos empíricos).  
* Cumplimiento normativo (archivo de documentos por 10 años, separación de funciones, control de acceso).  
* Mejora continua mediante retrospectivas y métricas objetivas.

### **7\. Recomendaciones Finales**

* Comenzar con un proyecto piloto en una empresa como “Empresa Norte” (fabricante de productos para bebés) para validar los módulos de gestión de pedidos y producción.  
* Capacitar al equipo en Scrum y en el uso de la herramienta (especialmente en la escritura de historias de usuario y criterios SMART).  
* Establecer un Comité de Control de Cambios con representantes de todas las áreas (desarrollo, calidad, negocio).  
* Utilizar la herramienta no solo para nuevos desarrollos sino también para mantenimiento y evolución de sistemas existentes (gestión de cambios y variantes).

