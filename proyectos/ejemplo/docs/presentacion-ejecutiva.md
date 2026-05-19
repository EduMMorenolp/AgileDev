---
proyecto: "Sistema de Pedidos Online"
version: 1.0
fecha: 2026-05-19
---
# Presentacion Ejecutiva: Sistema de Pedidos Online

## Pitch ejecutivo
Plataforma web de pedidos online que permite a clientes corporativos
realizar compras 24/7, reduciendo errores manuales y agilizando el
despacho. Integra catalogo en tiempo real, carrito de compras y
modulo de despacho para operadores.

## Stakeholders

**Involucrados:** Gerente de Operaciones (patrocinador), Clientes actuales,
Equipo de deposito, Area de Sistemas, Proveedores de logistica

**Matriz poder-interes:** Gerente de Operaciones (alto poder, alto interes),
Clientes (bajo poder, alto interes), Deposito (bajo poder, alto interes),
Sistemas (alto poder, bajo interes)

**Decisor del presupuesto:** Gerente de Operaciones

**Aprobador de cambios:** Comite de Producto (Gerente + Sistemas + Calidad)

**Frecuencia de comunicacion:** Semanal durante desarrollo, quincenal post-lanzamiento

**Canal de comunicacion:** Email + reunion semanal de 30 min

## Analisis de Riesgos

| Tipo | Descripcion |
|------|-------------|
| Mercado | Competidores lanzando plataformas similares. Diferenciador: integracion con ERP propio. |
| Legal / Normativo | Datos de clientes: cumplir Ley de Proteccion de Datos Personales. Facturacion electronica AFIP. |
| Adopcion | Clientes actuales acostumbrados a pedir por telefono. Capacitacion y periodo de solapamiento. |
| Dependencia externa | API de pagos (Mercado Pago), servicio de envio (Andreani). Contratos SLA necesarios. |

## Justificacion de negocio

**Estrategia:** Build (desarrollo interno con equipo propio). El ERP existente
requiere integracion a medida que ninguna solucion del mercado ofrece.

**ROI estimado:** Recuperacion de la inversion en 8 meses. Ahorro estimado:
$2M anuales en errores de pedidos y horas de telefonia.

**Competidores / Alternativas:** Tiendanube, WooCommerce, Vtex. Ninguno se
integra con el ERP interno sin desarrollo adicional.

**Analisis FODA:**
- Fortalezas: integracion con ERP, conocimiento del negocio
- Oportunidades: venta 24/7, nuevos segmentos digitales
- Debilidades: equipo tecnologico pequeno
- Amenazas: competidores con plataformas maduras

**Peor escenario si no se hace:** Seguir perdiendo ventas fuera de horario
laboral. Rotura de stock por errores manuales. Clientes migrando a
competidores con plataforma digital.

## Metricas de exito

| Categoria | Indicadores |
|-----------|-------------|
| Producto | 100 pedidos/dia primer mes, NPS > 60, tiempo de pedido < 5 min |
| Tecnicas | Uptime 99.5%, carga de catalogo < 2 seg, 0 errores criticos |
| Negocio | Reduccion de errores en 80%, ahorro $2M/ano, 30% ventas fuera de horario |

## Cronograma de hitos
- Mes 1-2: Catalogo de productos + login
- Mes 3-4: Carrito de compras + confirmacion
- Mes 5-6: Modulo de despacho + tracking
- Mes 7: Pagos online + pruebas UAT
- Mes 8: Lanzamiento oficial + capacitacion

## Equipo requerido
- 1 Tech Lead
- 2 Desarrolladores Fullstack
- 1 QA
- 1 Product Owner (Gerente de Operaciones)
