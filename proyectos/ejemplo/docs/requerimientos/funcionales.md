---
modulo: "Sistema de Pedidos Online"
tipo: funcionales
version: 1.0
fecha: 2026-05-19
---
# Requerimientos Funcionales: Sistema de Pedidos Online

## Epicas del proyecto

| ID | Epica | Descripcion | Prioridad | Dependencias |
|----|-------|-------------|-----------|--------------|
| E-01 | Catalogo de Productos | Gestion y visualizacion del catalogo con stock en tiempo real | Must | - |
| E-02 | Carrito de Compras | Armado, modificacion y confirmacion de pedidos | Must | E-01 |
| E-03 | Modulo de Despacho | Recepcion, preparacion y tracking de pedidos en deposito | Should | E-02 |

## MVP (Minimum Viable Product)
Catalogo de productos consultable + carrito de compras basico con
confirmacion automatica. Sin modulo de despacho (se gestiona manualmente).

## Roadmap
- Sprint 1-2: Catalogo de productos con busqueda y stock
- Sprint 3-4: Carrito de compras con confirmacion de pedido
- Sprint 5-6: Modulo de despacho con tracking
- Sprint 7: Pagos online y notificaciones
