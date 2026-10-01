import { Injectable } from '@angular/core';
import { ErcaCardData, EvaluationData } from '../models/lesson-plan.model';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly groqApiKey = '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';

  async generateDidacticSequence(
    subject: string,
    topic: string,
    dcdCode: string,
    dcdText: string,
    totalMinutes: number = 80,
    insertions: string[] = ['CS']
  ): Promise<{ stages: ErcaCardData[]; evaluation: EvaluationData; insertionConnection: string }> {
    
    const expMin = Math.round(totalMinutes * 0.15);
    const refMin = Math.round(totalMinutes * 0.20);
    const conMin = Math.round(totalMinutes * 0.35);
    const aplMin = totalMinutes - (expMin + refMin + conMin);

    const systemPrompt = `
Actúa como un Auditor Curricular y Diseñador Pedagógico del Ministerio de Educación del Ecuador (MinEduc), especialista en el ciclo metodológico ERCA, DUA 3.0 e INSERCIONES CURRICULARES (Competencias Socioemocionales CS, Educación Integral en Sexualidad/Afectividad EIS, Desarrollo Sostenible EDS, Educación Financiera EF, Gestión de Riesgos EVR).

Debes estructurar una microplanificación didáctica oficial respondiendo ÚNICAMENTE con un JSON válido con esta estructura:

{
  "insertionConnection": "Explicación breve (1 o 2 oraciones) de cómo esta clase promueve activamente las inserciones curriculares (${insertions.join(', ')}).",
  "stages": [
    {
      "stage": "experiencia",
      "title": "Experiencia Concreta",
      "durationMinutes": ${expMin},
      "activity": "Actividad vivencial contextualizada.",
      "resources": ["Recursos"],
      "dua": {
        "principle": "implicacion",
        "title": "Múltiples Formas de Implicación",
        "strategy": "Estrategia concreta DUA para motivar e involucrar."
      }
    },
    {
      "stage": "reflexion",
      "title": "Reflexión y Análisis",
      "durationMinutes": ${refMin},
      "activity": "Mediación con preguntas problematizadoras.",
      "guidingQuestions": [
        "¿Pregunta 1?",
        "¿Pregunta 2?",
        "¿Pregunta 3?"
      ],
      "resources": ["Recursos"],
      "dua": {
        "principle": "representacion",
        "title": "Múltiples Formas de Representación",
        "strategy": "Estrategia multimodal para apoyar la comprensión."
      }
    },
    {
      "stage": "conceptualizacion",
      "title": "Conceptualización y Sistematización",
      "durationMinutes": ${conMin},
      "activity": "Construcción formal del conocimiento.",
      "keyConcepts": ["Concepto 1", "Concepto 2"],
      "resources": ["Recursos"],
      "dua": {
        "principle": "representacion",
        "title": "Múltiples Formas de Representación",
        "strategy": "Uso de esquemas o código de colores."
      }
    },
    {
      "stage": "aplicacion",
      "title": "Aplicación Práctica / Reto Didáctico",
      "durationMinutes": ${aplMin},
      "activity": "Reto práctico de transferencia al entorno real.",
      "resources": ["Recursos"],
      "dua": {
        "principle": "accion_expresion",
        "title": "Múltiples Formas de Acción y Expresión",
        "strategy": "Opciones flexibles para evidenciar el aprendizaje."
      }
    }
  ],
  "evaluation": {
    "indicator": "Código y texto del indicador oficial MinEduc.",
    "technique": "Técnica activa formal.",
    "instrument": "Rúbrica analítica.",
    "rubric": [
      { "level": "Excelente", "descriptor": "Dominio autónomo y riguroso." },
      { "level": "Satisfactorio", "descriptor": "Procedimiento correcto con soporte mínimo." },
      { "level": "En proceso", "descriptor": "Requiere acompañamiento docente." }
    ]
  }
}

Reglas:
- La suma exacta de durationMinutes debe ser ${totalMinutes}.
- Explicitar el vínculo con la inserción curricular en el campo 'insertionConnection'.
`;

    const userPrompt = `Diseña la planificación didáctica para:
- Asignatura: ${subject}
- Bloque/Eje: ${topic}
- DCD: [${dcdCode}] ${dcdText}
- Inserciones curriculares asignadas: ${insertions.join(', ')}
- Tiempo total: ${totalMinutes} minutos.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.groqApiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.25
      })
    });

    if (!response.ok) {
      const errDetail = await response.text();
      throw new Error(`Error en API Groq (${response.status}): ${errDetail}`);
    }

    const payload = await response.json();
    return JSON.parse(payload.choices[0].message.content);
  }
}