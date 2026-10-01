---
doc: scope
status: approved
---

# EduPlan ERCA/DUA

Una SPA en Angular que, en minutos, convierte un fragmento curricular en una microplanificación didáctica ERCA + DUA + evaluación, lista para ver en tarjetas o en tabla formal.

## The Unique Kernel
No es un generador de planes genéricos. Es coherencia didáctica visible: la DCD oficial no se inventa ni se diluye; los cuatro momentos ERCA van cronometrados, aplicables con recursos de aula común y sin mezclarse; el DUA trae acciones concretas (enganchar, presentar, demostrar); la evaluación (indicador + rúbrica) encaja con esa destreza. Un viernes por la tarde, tranquilidad en ~3 minutos — no relleno tipo “el docente explica y los alumnos toman apuntes”.

## Who It's For
El docente de aula (primaria, secundaria o bachillerato) que el viernes, para cumplir con vicerrectorado, transcribe verbos y matrices curriculares a formatos de microplanificación. Quiere tiempo libre y una clase que sí se pueda dar el lunes, no un trámite vacío.

## The Core Loop
Abre EduPlan → carga un ejemplo (o ve los pocos campos: asignatura, nivel, tema, DCD, períodos) → “Estructurar planificación didáctica” (estado de carga limpio) → revisa tarjetas ERCA, DUA y evaluación → edita lo que no le convence → “Vista de documento oficial” (tabla) → imprime o copia. En el PoC, ese recorrido se demuestra con casos modelo, no con una API en vivo.

## Inspiration & Identity
Kolb adaptado como ERCA; DUA en tres principios con gesto de aula, no teoría. Dashboard educativo moderno: sobrio, limpio, sin estética infantil ni “colores de IA”. Dual: tarjetas por momento didáctico **o** tabla curricular clásica. Actividades significativas y retadoras, no párrafos de relleno.

## Why This Matters to the Learner
Devolver tiempo y tranquilidad al docente, y transformar la planificación de trámite en proceso didáctico enriquecedor. En este hackathon también: practicar plan-primero con un agente, Angular modular, y ver un PoC de punta a punta.

## What "Working" Looks Like
En un video de ~1–2 minutos, sin fallos de red: “Cargar ejemplo” (P0 Informática/Programación; P1 Matemáticas/Física si el tiempo de build lo permite; DCD oficiales ya cargadas) → “Estructurar…” con carga visual → aparecen los cuatro momentos con tiempos en minutos, DUA de tres principios, indicador y rúbrica (Excelente / Satisfactorio / En proceso) → se edita una tarjeta → la vista oficial muestra la tabla ministerial lista para imprimir o copiar. El “oh” es ver una clase practicable y coherente, no un bloque de texto plano.

## The POC Boundary
- Casos modelo de alta calidad pedagógica: **P0 (obligatorio en el video)** Informática/Programación (ERCA práctico y visual). **P1 (si el tiempo de implementación lo permite)** Matemáticas/Física.
- Formulario mínimo + botón principal + estado de carga.
- Visor: E, R, C, A (dinámica detonante; preguntas de conflicto cognitivo; conceptos y recursos; reto/mini-proyecto), cada uno con tiempo estimado.
- DUA: Motivación/Compromiso, Representación, Acción/Expresión — acciones concretas de aula.
- Evaluación: indicador desagregado + rúbrica sintética de tres niveles.
- Edición en pantalla de tarjetas ERCA y criterios de evaluación antes de la vista oficial.
- Vista tabla formal: Datos informativos; Destreza (DCD); Estrategias metodológicas activas (E, R, C, A con tiempos y recursos); Recursos; Actividades evaluativas (indicador + técnicas e instrumentos/rúbrica). Imprimir o copiar. Columnas exactas del formato de planificación microcurricular **Ecuador / MinEduc** se afinan en el PRD.
- En código: contrato `LessonPlan` y servicio inyectable (p. ej. `PlanningGenerationService`) que resuelve con plantillas/mock; métodos asíncronos pensados para enchufar una API después, sin reescribir la UI.

## Later
IA en vivo (Gemini, Claude u otra) sobre DCD pegada por el docente; más asignaturas y niveles; cuentas y guardado; export “de archivo” a plantillas ministeriales reales; planificación semanal/de unidad más allá de una clase modelo.

## Explicitly Cut
- **Generación por API en el demo:** el video no puede depender de red, claves ni calidad variable.
- **Inventar códigos o DCD:** si entra una destreza oficial, no se sustituye por una ficticia (en el PoC las DCD vienen de los casos modelo).
- **Actividades de relleno y momentos mezclados:** no “explica y toma apuntes”; no fusionar reflexión con conceptualización.
- **Producto completo:** autenticación, backend, todos los grados, sync con el ministerio.
