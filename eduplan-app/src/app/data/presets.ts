import { LessonPlan } from '../models/lesson-plan.model';

export const PRESET_P0_INFORMATICA: LessonPlan = {
  header: {
    institution: 'Unidad Educativa Experimental',
    teacher: 'Docente Responsable',
    subject: 'Informática Aplicada / Programación',
    gradeLevel: '1.° BGU',
    parallel: 'A',
    week: 'Semana 1',
    periods: 2,
    topic: 'Estructuras de Control Condicionales (if / else)',
    dcdCode: 'CS.INF.4.1.3',
    dcdText: 'Codificar algoritmos estructurados aplicando condicionales lógicas simples y dobles para resolver problemas de toma de decisiones cotidianas.'
  },
  stages: [
    {
      stage: 'experiencia',
      title: 'Experiencia Concreta',
      durationMinutes: 15,
      activity: 'Dinámica "Semáforo Inteligente": simular el control de acceso a un laboratorio donde los estudiantes plantean condiciones reales (tarjeta activa vs inactiva).',
      resources: ['Tarjetas físicas de colores', 'Proyector con simulador visual simple'],
      dua: {
        principle: 'implicacion',
        title: 'Múltiples formas de Implicación',
        strategy: 'Vincular el reto a situaciones reales de su entorno escolar para activar interés y pertinencia.'
      }
    },
    {
      stage: 'reflexion',
      title: 'Reflexión y Análisis',
      durationMinutes: 15,
      activity: 'Debate guiado sobre el flujo de decisiones: análisis de qué ocurre si una condición no se cumple y cómo reacciona un sistema informático.',
      guidingQuestions: [
        '¿Qué ocurre en un cajero si la clave es correcta pero el saldo es cero?',
        '¿Podemos evaluar más de un camino al mismo tiempo?',
        '¿Por qué las máquinas requieren instrucciones binarias estrictas?'
      ],
      resources: ['Pizarra interactiva o pizarrón', 'Guía de preguntas mediadoras'],
      dua: {
        principle: 'representacion',
        title: 'Múltiples formas de Representación',
        strategy: 'Presentar las ramas lógicas con diagramas de flujo coloreados y código comentado simultáneamente.'
      }
    },
    {
      stage: 'conceptualizacion',
      title: 'Conceptualización y Sistematización',
      durationMinutes: 25,
      activity: 'Formalización de la sintaxis: estructura if/else, operadores de comparación (==, !=, >, <) y tabla de verdad básica. Construcción conjunta de diagrama de flujo.',
      keyConcepts: ['Condición booleana', 'Rama verdadera (if)', 'Rama falsa (else)', 'Indentación'],
      resources: ['Guía conceptual digital', 'Editor interactivo en proyector'],
      dua: {
        principle: 'representacion',
        title: 'Múltiples formas de Representación',
        strategy: 'Ofrecer organizadores gráficos descargables y código con sintaxis resaltada por contrastes.'
      }
    },
    {
      stage: 'aplicacion',
      title: 'Aplicación Práctica / Reto',
      durationMinutes: 25,
      activity: 'Reto de código en parejas: implementar un validador de calificaciones que determine si un estudiante está "Aprobado", "En recuperación" o "Reprobado".',
      resources: ['Computadoras de laboratorio o simulador web', 'Hoja guía de retos'],
      dua: {
        principle: 'accion_expresion',
        title: 'Múltiples formas de Acción y Expresión',
        strategy: 'Permitir entregar el reto mediante código en vivo, pseudocódigo estructurado o diagrama de flujo verificado.'
      }
    }
  ],
  evaluation: {
    indicator: 'I.CS.INF.4.1.3. Diseña y ejecuta algoritmos con estructuras condicionales verificando la exactitud de sus salidas lógicas.',
    technique: 'Resolución de problemas técnicos guiados',
    instrument: 'Rúbrica analítica por niveles de desempeño',
    rubric: [
      {
        level: 'Excelente',
        descriptor: 'Construye la lógica condicional sin errores sintácticos, abarca todos los casos borde y optimiza las bifurcaciones.'
      },
      {
        level: 'Satisfactorio',
        descriptor: 'Aplica condicionales if/else correctamente en la mayoría de casos, requiriendo asistencia menor en casos borde.'
      },
      {
        level: 'En proceso',
        descriptor: 'Identifica la necesidad del condicional pero presenta fallas en la formulación de expresiones lógicas o sintaxis.'
      }
    ]
  }
};

export const PRESET_P1_MATEMATICAS: LessonPlan = {
  header: {
    institution: 'Unidad Educativa Experimental',
    teacher: 'Docente Responsable',
    subject: 'Matemática y Física Integrada',
    gradeLevel: '1.° BGU',
    parallel: 'A',
    week: 'Semana 1',
    periods: 2,
    topic: 'Cinemática: Movimiento Rectilíneo Uniformemente Variado (MRUV)',
    dcdCode: 'M.4.1.18',
    dcdText: 'Calcular la aceleración y distancia recorrida por un móvil con aceleración constante a partir de datos experimentales y gráficos v-t.'
  },
  stages: [
    {
      stage: 'experiencia',
      title: 'Experiencia Concreta',
      durationMinutes: 15,
      activity: 'Experimento con plano inclinado: deslizar un móvil midiendo tiempos en tramos iguales mediante cronómetros de teléfono móvil.',
      resources: ['Rampa inclinada', 'Esfera o carrito', 'Cinta métrica y cronómetro'],
      dua: {
        principle: 'implicacion',
        title: 'Múltiples formas de Implicación',
        strategy: 'Trabajo por roles rotativos (cronometrista, lanzador, registrador) para favorecer la participación de todo el equipo.'
      }
    },
    {
      stage: 'reflexion',
      title: 'Reflexión y Análisis',
      durationMinutes: 15,
      activity: 'Comparación de velocidades en cada tramo: responder por qué el tiempo disminuye si la distancia entre marcas es la misma.',
      guidingQuestions: [
        '¿Por qué el carro tarda menos tiempo en recorrer los últimos 50 cm?',
        '¿La velocidad fue la misma en todo el trayecto?',
        '¿Cómo llamamos al cambio de velocidad con respecto al tiempo?'
      ],
      resources: ['Tabla de datos en pizarra', 'Gráfica preliminar mano alzada'],
      dua: {
        principle: 'representacion',
        title: 'Múltiples formas de Representación',
        strategy: 'Uso de tablas tabuladas y animaciones cinemáticas vectoriales para visualizar el vector aceleración.'
      }
    },
    {
      stage: 'conceptualizacion',
      title: 'Conceptualización y Sistematización',
      durationMinutes: 25,
      activity: 'Deducción de las fórmulas básicas del MRUV (a = Δv/Δt y d = v0*t + 1/2*a*t²). Interpretación del área bajo la curva en el gráfico v vs t.',
      keyConcepts: ['Aceleración constante', 'Pendiente v-t', 'Área bajo la curva'],
      resources: ['Formulario resumido', 'Simulador interactivo PhET'],
      dua: {
        principle: 'representacion',
        title: 'Múltiples formas de Representación',
        strategy: 'Complementar las ecuaciones algebraicas con código de colores para cada magnitud (v en azul, a en rojo, t en verde).'
      }
    },
    {
      stage: 'aplicacion',
      title: 'Aplicación Práctica / Reto',
      durationMinutes: 25,
      activity: 'Resolución de caso real: calcular la distancia de frenado de seguridad que requiere un autobús urbano a 50 km/h en pavimento mojado.',
      resources: ['Hoja de cálculo o guía impresa de ejercicios aplicados'],
      dua: {
        principle: 'accion_expresion',
        title: 'Múltiples formas de Acción y Expresión',
        strategy: 'Opciones de resolución: cálculo algebraico tradicional paso a paso o verificación mediante simulación digital.'
      }
    }
  ],
  evaluation: {
    indicator: 'I.M.4.1.18. Modela matemáticamente situaciones cinemáticas reales aplicando ecuaciones de aceleración constante.',
    technique: 'Prueba de desempeño con resolución de problemas de contexto',
    instrument: 'Rúbrica analítica ponderada',
    rubric: [
      {
        level: 'Excelente',
        descriptor: 'Identifica variables, despeja ecuaciones con precisión y contextualiza el significado físico del resultado obtenido.'
      },
      {
        level: 'Satisfactorio',
        descriptor: 'Aplica las fórmulas correctas con errores mínimos de cálculo aritmético que no comprometen el razonamiento físico.'
      },
      {
        level: 'En proceso',
        descriptor: 'Confunde las ecuaciones de MRU con MRUV o presenta dificultades operativas en el despeje algebraico de la aceleración.'
      }
    ]
  }
};