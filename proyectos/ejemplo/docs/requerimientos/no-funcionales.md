---
modulo: "Sistema de Pedidos Online"
tipo: no-funcionales
version: 1.0
fecha: 2026-05-19
---
# Requerimientos No Funcionales: Sistema de Pedidos Online

## Rendimiento
- Las paginas deben cargar en menos de 3 segundos en conexion 4G
- Soporte para 100 usuarios concurrentes sin degradacion
- Consultas al catalogo con respuesta en menos de 500 ms

## Seguridad
- Todo el trafico debe ir por HTTPS
- Autenticacion mediante JWT con expiracion de sesion
- Roles de usuario: cliente y administrador
- Los datos de pago deben cumplir PCI DSS

## Usabilidad
- Diseño mobile-first adaptable a desktop
- Un pedido se debe completar en maximo 3 pasos
- Feedback visual inmediato ante cada accion del usuario

## Compatibilidad
- Chrome, Firefox, Safari y Edge (2 versiones anteriores a la actual)
- Soporte responsive en tablets y smartphones

## Mantenibilidad
- Codigo modular con separacion clara de capas (frontend, API, BD)
- Tests unitarios con cobertura minima del 80%
- Documentacion tecnica basica actualizada por sprint
