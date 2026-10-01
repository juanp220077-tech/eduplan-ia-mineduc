---
doc: prd
status: approved
---

# EduPlan ERCA/DUA — Product Requirements

SPA de una sola superficie para docentes de aula: de un fragmento curricular (caso modelo) a una microplanificación ERCA + DUA + evaluación, en tarjetas editables o en tabla MinEduc Ecuador lista para copiar o imprimir.
Source: `scope.md > Who It's For`, `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

## The Core Journey

1. El docente abre EduPlan y ve cabecera institucional, panel de parámetros vacío (o con placeholders) a la izquierda y, a la derecha, estado vacío con silueta de tarjetas y el mensaje de invitación.
2. Pulsa **Cargar Ejemplo (Informática P0)** (o elige P1 Matemáticas en el desplegable, si está implementado). Los campos izquierdos se llenan con datos reales y consistentes; el botón **Estructurar Microplanificación Didáctica** queda listo.
3. Pulsa estructurar. El botón izquierdo pasa a ocupado (“Estructurando…”). La derecha muestra ~1,5 s de carga: barra por etapas (DCD → ERCA → DUA → evaluación) y esqueletos de tarjetas.
4. Aparece la **Vista Didáctica / Tarjetas ERCA** (pestaña por defecto): banner con DCD y tiempo total; cuatro tarjetas E–R–C–A en cascada (slide-up), cada una con tiempo, contenido practicable y chips DUA + desplegable de adaptaciones; debajo, bloque de evaluación (indicador, técnica/instrumento, rúbrica de tres niveles, evidencia).
5. Edita en el sitio cualquier texto de tarjeta, chips/adaptaciones DUA o celdas de rúbrica. No hay Guardar: hay un solo estado en memoria.
6. Cambia a **Vista Oficial MinEduc / Tabla**: solo lectura, ya sincronizada. Copia al portapapeles o Imprimir/Guardar PDF (chrome de app oculto; hoja A4).
7. Éxito del PoC: en ~1–2 min de video, sin red, se ve una clase P0 coherente, editable y presentable — no un bloque de texto genérico.

## Screens and Layout

Una sola pantalla, dos columnas. Source: entrevista PRD; `scope.md > Inspiration & Identity`.

**Cabecera:** título `EduPlan ERCA/DUA`; subtítulo `Microplanificación Didáctica y Adaptaciones DUA`; indicador `MinEduc Ecuador - Formato Oficial`; a la derecha **Cargar Ejemplo (Informática P0)** y selector opcional P1 Matemáticas.

**Izquierda (~35–40%):** asignatura; curso/nivel; tema; carga horaria/períodos; área de texto DCD (redacción intacta); al pie el botón primario de estructurar.

**Derecha (~60–65%):** alternador **Vista Didáctica / Tarjetas ERCA** | **Vista Oficial MinEduc / Tabla**; acciones **Copiar al portapapeles** e **Imprimir / Guardar PDF**. Contenido: vacío → carga → tarjetas o tabla.

No hay otras pantallas, login ni listado de planes.

## Look and Feel

Productividad de escritorio, neutro pizarra + acento institucional. Evitar estética infantil y “colores genéricos de IA”.

- Fondo app: slate suave (`#F8FAFC` o `#F1F5F9`). Tarjetas/contenedores: blanco, borde `#E2E8F0`, sombra de elevación 1.
- Acento cabecera y primarios: azul marino/slate dark (`#1E293B` o `#0F172A`); acción cobalto `#2563EB`.
- Badges ERCA desaturados: E ámbar `#FEF3C7` / `#92400E`; R índigo `#EEF2FF` / `#3730A3`; C azul `#E0F2FE` / `#0369A1`; A esmeralda `#D1FAE5` / `#065F46`.
- Chips DUA pastel: implicación verde salvia; representación lavanda; acción/expresión celeste.
- UI: sans moderna (`Inter`, system-ui o Segoe UI); títulos semibold 600, cuerpo 400.
- Tabla impresión: misma familia, grises, bordes `#CBD5E1`; fondo blanco, tipografía sobria.

## Features and Behavior

### Cargar caso modelo
Source: `scope.md > The POC Boundary` (P0/P1).

Rellena de una vez asignatura, nivel, tema, períodos y DCD oficial del caso. P0 (Informática/Programación, visual para ERCA) es obligatorio en el demo. P1 (Matemáticas/Física) solo si el tiempo de implementación lo permite.

### Estructurar microplanificación
Source: `scope.md > The Unique Kernel`.

Muestra feedback inmediato y luego un plan **no genérico**: actividades de aula real, momentos ERCA sin mezclar, DCD no inventada (sale del caso modelo), tiempos que suman los períodos (P0: 15+15+25+25 min = 80 min / 2 períodos, salvo que el ejemplo declare otra distribución coherente).

Cada tarjeta ERCA incluye propósito implícito en el contenido y, de forma transversal, chips DUA (Implicación, Representación, Acción/Expresión) y **Adaptaciones DUA sugeridas** desplegables — no un apéndice teórico suelto. Evaluación alineada a la DCD: indicador, técnica, instrumento (rúbrica Excelente / Satisfactorio / En proceso), evidencia ligada a Aplicación.

### Editar en tarjetas
Source: `scope.md > The POC Boundary` (edición).

Clic en el texto: edición en sitio (sin modales). Hover: borde punteado o lápiz tenue; foco: acento primario. Rúbrica: descriptores de nivel editables en la celda. La tabla oficial **no** se edita.

### Vista oficial MinEduc
Source: `scope.md > The POC Boundary` (tabla formal).

- **Datos informativos** (cuadrícula 2–3 columnas): institución (Unidad Educativa / Colegio Modelo), docente (valor del ejemplo), asignatura, grado/curso y paralelo, fecha/semana y períodos, título de unidad/tema.
- **Tabla de 3 columnas:** (1) DCD código + texto íntegro; (2) estrategias metodológicas activas por ERCA con tiempos y recursos, y al pie adaptaciones DUA de los tres principios; (3) actividades evaluativas (indicador, técnica, instrumento/rúbrica).
- **Firmas:** Elaborado (Docente) | Revisado (Comisión Técnico Pedagógica) | Aprobado (Vicerrectorado).
- Sincronización inmediata con las tarjetas (un solo estado). Vista de previsualización limpia para imprimir o seleccionar/copiar.

### Copiar e imprimir
Copiar pone en el portapapeles el contenido útil de la vista activa (didáctica o tabla). Imprimir/PDF usa impresión del navegador; `@media print` oculta botones y navegación; márgenes A4 vertical u horizontal.

## States and Boundaries

- **Primera visita / vacío** — mensaje: ingresar datos o **Cargar Ejemplo** para estructurar con ERCA y DUA; silueta atenuada de tarjetas; aún no hay plan que copiar o imprimir de forma útil.
- **Tras cargar ejemplo** — campos izquierdos consistentes; estructurar habilitado.
- **Carga (~1,5 s)** — botón “Estructurando…” deshabilitado; skeleton + etapas de alineación; sin salto brusco de layout.
- **Éxito didáctico** — pestaña tarjetas activa; banner DCD + tiempo total; cuatro tarjetas y evaluación.
- **Vista oficial** — tabla ministerial de solo lectura, al día con ediciones.
- **Sin persistencia** — recargar o cerrar la pestaña pierde el trabajo (PoC en memoria).
- **Campos requeridos vacíos** — el botón estructurar permanece deshabilitado y/o muestra tooltip/mensaje sutil: completar campos o **Cargar Ejemplo**. Nunca inventa un plan.
- **Copiar/imprimir sin plan** — copiar e imprimir deshabilitados o no visibles en el empty state hasta que haya planificación en memoria.

## Product Decisions

- Demo con **plantillas/casos**, no API — video impecable sin red.
- **P0 Informática** obligatorio; **P1 Matemáticas** opcional por tiempo.
- DUA **dentro de cada tarjeta** (chips + desplegable), tres principios con acciones de aula.
- Edición **inline** solo en tarjetas/rúbrica; tabla oficial **solo lectura**.
- Un estado, **sin botón Guardar**.
- Fuera: **Ajustar con prompt**, **Word nativo**.
- Formato de entrega: **Ecuador / MinEduc**, tabla de 3 columnas + datos + firmas.
- Estética: slate + marino/cobalto, Inter/system-ui, badges ERCA y chips DUA pastel.
- Sin DCD/campos: estructurar deshabilitado (tooltip a completar o cargar ejemplo). Copiar/imprimir deshabilitados u ocultos hasta haber plan en memoria.

## What We're Building

- Superficie única: cabecera, entrada, visor con dos pestañas, copiar e imprimir.
- Caso P0 completo (contenido pedagógico de calidad, DCD oficial).
- Carga visual, tarjetas ERCA con tiempos y DUA transversal, evaluación con rúbrica de 3 niveles.
- Edición inline y sincronización a la tabla oficial.
- Tabla MinEduc simplificada pero reconocible + print CSS.
- P1 solo si cabe en el tiempo de build.

## Deferred From the POC

- IA en vivo / “Ajustar con prompt” — red, claves, calidad variable.
- Export Word nativo — el navegador cubre el demo.
- Cuentas, guardado, listado de planificaciones.
- Pegar DCD arbitraria y generar de verdad (el PoC demuestra el recorrido con el caso modelo).
- Archivo ministerial “oficial” descargable distinto de print/copia.

## Possible Later Enhancements

Enchufe de API (Gemini/Claude u otra) sobre el mismo contrato de plan. Más asignaturas. Persistencia. P1 si no entra en este hackathon. Export a plantillas MinEduc reales.

## Non-Goals

- Inventar códigos o DCD — el caso modelo trae la destreza intacta.
- Actividades de relleno (“explica y toma apuntes”) o mezclar Reflexión con Conceptualización.
- Autenticación, backend, sync ministerial.
- Segunda pantalla o wizard de varios pasos.

## Open Questions

- Textos exactos P0 (DCD, actividades, rúbrica de calidad): se redactan en build con criterio del learner; no bloquean `4-spec` de arquitectura.
- P1: se decide en build según tiempo (`scope.md` ya lo marca opcional).
- Ninguno que bloquee spec: P0 pedagógico y P1 por tiempo se resuelven en build.
