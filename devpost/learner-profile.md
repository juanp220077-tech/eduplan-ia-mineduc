---
doc: learner-profile
---
<!-- Capture only context later skills can use. Keep it scannable and short, not a transcript.
     Record what the learner shared or demonstrated, with brief evidence where useful.
     Don't infer beyond the evidence or assign fixed labels. "Not established" is useful.
     Optional sections need not be filled; don't turn this template into a questionnaire. -->

# Learner Profile

## Initial Idea
SPA en Angular llamada **EduPlan ERCA/DUA**, orientada a docentes. Problema: horas fuera del aula transcribiendo currículos oficiales a formatos burocráticos de planificación semanal y de unidad.

PoC end-to-end que el learner propuso (punto de partida, no alcance aprobado):
1. Seleccionar o pegar fragmento curricular: asignatura, tema, nivel educativo y Destrezas con Criterio de Desempeño (DCD) oficiales.
2. Ingresar carga horaria semanal (ej. 4 horas pedagógicas).
3. Generar microplanificación bajo ERCA: Experiencia, Reflexión, Conceptualización, Aplicación.
4. Incluir adaptaciones DUA (múltiples formas de representación y expresión; más adelante también nombró motivación).
5. Generar indicador de evaluación oficial e instrumento (rúbrica o escala de valoración).
6. Salida en tarjetas interactivas y botón para exportar o previsualizar el formato oficial listo para entregar.

## Demonstrated Technical and Agent Experience
**Pedagogía (fuerte declarado):** diseño curricular, metodología ERCA, marcos DUA y evaluación educativa.
**Programación (auto-descrito como nivel medio):** entiende estructura de proyectos web y lógica de código; pide guía clara en arquitectura técnica y explicaciones paso a paso de decisiones de implementación.
**Agentes:** no relató experiencia previa de agente trabajando en un repositorio; esta es la primera vez en ese formato estructurado.
Stack deseado nombrado: Angular, SPA.
Evidence: “en programación tengo un nivel medio… me ayuda mucho que la IA me guíe con claridad en la arquitectura técnica y me explique las decisiones de implementación paso a paso.”

## Planning-Workflow Experience
**New** al flujo plan-primero estructurado con un agente en un repositorio. Conoce la lógica de planificar antes de ejecutar (contexto pedagógico y general), pero no ha usado este curriculum de alcance → PRD → spec → build.
Evidence: “conozco la lógica de planificar antes de ejecutar, pero es mi primera vez usándolo de forma tan estructurada con un agente de IA en un repositorio.”

## Desired Learning Outcome
Tres intenciones (usar las tres como contexto; no ampliar alcance por ello):
1. Colaborar de forma estructurada con un agente mediante este flujo guiado (especificar antes de codificar para evitar deuda cognitiva).
2. Afianzar buenas prácticas modernas en Angular en una interfaz limpia y modular.
3. Ver el PoC funcionando de punta a punta: planificación ERCA, adaptaciones DUA y evaluación en un formato presentable que ahorre tiempo al docente.

## Learning Moments
Not established — onboarding only.

## Interests, Inspirations, and Goals
**Usuarios:** docentes de aula (primaria, secundaria y bachillerato) con carga burocrática semanal de desglosar matrices curriculares en formatos de microplanificación exigidos por autoridades.
**Inspiración:** transformar la planificación de trámite tedioso en proceso didáctico enriquecedor. Ciclo vivencial de Kolb adaptado como ERCA + tres principios DUA (motivación, representación, acción/expresión). Actividades de clase significativas y retadoras, no párrafos genéricos de relleno.
**Toque personal de UI:** interfaz sobria, limpia, dashboard educativo moderno; sin estética infantil ni “colores genéricos de IA”. Ver planificación en tarjetas dinámicas por momentos didácticos **o** en la clásica tabla curricular, lista para exportar o imprimir.

## Vocabulary and Concepts Likely to Need Explanation
**Claramente familiar (no re-enseñar como si fueran nuevos):** ERCA, DUA, DCD, indicador de evaluación, rúbrica/escala, microplanificación, currículo oficial, Kolb.
**Explicar con claridad cuando toque decidir:** arquitectura Angular (módulos/componentes/servicios, dónde vive el estado, cómo se genera el contenido), SPA, exportar/imprimir, y el flujo del agente (scope, PRD, spec, pasos de build, commits).
No asumir desconocimiento de términos web no mencionados; calibrar al pedir decisiones técnicas.

## Collaboration and Communication Preferences
Acompañamiento **equilibrado y guiado**: rigor pedagógico de la solución + construcción en Angular. Explicaciones claras de arquitectura e implementación. Preguntas **una a una** (no pidió lotes). No estableció formato de revisión de documentos.

## Areas Where the Learner Wants Ownership
Rigor pedagógico y didáctico de la solución (ERCA, DUA, evaluación, que no sea relleno genérico). Decisiones de producto sobre usuarios docentes y tono visual (dashboard sobrio). Preferencia de stack Angular ya expresada; sigue sujeta a acuerdo en spec.

## Likely Support Needs
Guía de arquitectura Angular y de decisiones de implementación, paso a paso. Conservar beginner guidance del flujo plan-primero (primera vez estructurado con agente). No pedir que invente detalles de ingeniería sin explicación de opciones. No solicitar credenciales en chat.

## Review Format

markdown

## Notes and Open Questions
- El alcance detallado del PoC (IA vs. plantillas, persistencia, qué “oficial” significa para el formato de entrega, DUA de tres principios vs. dos nombrados al inicio) lo define `2-scope` / `3-prd`; no está aprobado aquí.
- Carpeta del proyecto: `planificador-docente-ia`. `learner-profile.md` está en `.gitignore` a propósito.
- Idioma de trabajo con el learner: español.
