import { Injectable, inject, signal, computed } from '@angular/core';
import { LessonPlan, ErcaStage, CurricularDcd, LessonPlanHeader } from '../models/lesson-plan.model';
import { GeminiService } from './gemini.service';

export type PlanningStatus = 'idle' | 'loading' | 'ready';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private readonly geminiService = inject(GeminiService);

  readonly currentPlan = signal<LessonPlan | null>(null);
  readonly status = signal<PlanningStatus>('idle');
  readonly activeTab = signal<'cards' | 'table'>('cards');

  readonly hasPlan = computed(() => this.currentPlan() !== null);
  readonly isGenerating = computed(() => this.status() === 'loading');

  async generateFromCurriculum(headerData: LessonPlanHeader, dcd: CurricularDcd): Promise<void> {
    this.status.set('loading');

    const duracion = headerData.periodDuration || 40;
    const periodos = headerData.periods || 2;
    const totalMinutes = periodos * duracion;
    const insertions = dcd.insertions && dcd.insertions.length > 0 ? dcd.insertions : ['CS'];

    try {
      const aiResult = await this.geminiService.generateDidacticSequence(
        headerData.subject,
        headerData.topic,
        dcd.code,
        dcd.description,
        totalMinutes,
        insertions
      );

      this.currentPlan.set({
        header: {
          ...headerData,
          periods: periodos,
          periodDuration: duracion,
          insertions: insertions,
          insertionConnection: aiResult.insertionConnection
        },
        stages: aiResult.stages,
        evaluation: aiResult.evaluation
      });
    } catch (error) {
      console.warn('Fallback pedagógico ante corte de conexión:', error);

      const expMin = Math.round(totalMinutes * 0.15);
      const refMin = Math.round(totalMinutes * 0.20);
      const conMin = Math.round(totalMinutes * 0.35);
      const aplMin = totalMinutes - (expMin + refMin + conMin);

      const fallbackPlan: LessonPlan = {
        header: {
          ...headerData,
          periods: periodos,
          periodDuration: duracion,
          insertions: insertions,
          insertionConnection: `Articulación transversal con ${insertions.join(', ')}: Fomento de la participación activa y el aprendizaje cooperativo.`
        },
        stages: [
          {
            stage: 'experiencia',
            title: 'Experiencia Concreta',
            durationMinutes: expMin,
            activity: `Activación vivencial vinculada al entorno cotidiano sobre: ${headerData.topic}.`,
            resources: ['Pizarrón', 'Material de lectura', 'Guía didáctica'],
            dua: {
              principle: 'implicacion',
              title: 'Múltiples Formas de Implicación',
              strategy: 'Vincular el reto a situaciones reales y significativas de la vida estudiantil.'
            }
          },
          {
            stage: 'reflexion',
            title: 'Reflexión y Análisis',
            durationMinutes: refMin,
            activity: 'Discusión en plenaria a partir de preguntas generadoras estructuradas:',
            guidingQuestions: [
              `¿Qué relación tiene ${headerData.topic} con nuestras actividades cotidianas?`,
              '¿Qué retos prácticos se presentan al aplicar este contenido?',
              '¿Cómo podemos validar los resultados obtenidos?'
            ],
            resources: ['Cuaderno de trabajo', 'Pizarra colaborativa'],
            dua: {
              principle: 'representacion',
              title: 'Múltiples Formas de Representación',
              strategy: 'Uso de esquemas gráficos y lluvia de ideas visual en panel.'
            }
          },
          {
            stage: 'conceptualizacion',
            title: 'Conceptualización y Sistematización',
            durationMinutes: conMin,
            activity: `Formalización conceptual de la destreza [${dcd.code}] y sistematización en organizador gráfico colaborativo.`,
            keyConcepts: [headerData.topic, 'Propiedades fundamentales', 'Procedimiento de resolución'],
            resources: ['Texto oficial MinEduc', 'Fichas resumen'],
            dua: {
              principle: 'representacion',
              title: 'Múltiples Formas de Representación',
              strategy: 'Código cromático para los pasos analíticos y conceptos clave.'
            }
          },
          {
            stage: 'aplicacion',
            title: 'Aplicación Práctica / Reto Didáctico',
            durationMinutes: aplMin,
            activity: `Resolución de reto contextualizado y aplicación práctica de la destreza: ${dcd.description}.`,
            resources: ['Ficha de actividades', 'Rúbrica de evaluación'],
            dua: {
              principle: 'accion_expresion',
              title: 'Múltiples Formas de Acción y Expresión',
              strategy: 'Entrega en cuaderno, informe sintetizado o presentación visual en equipos.'
            }
          }
        ],
        evaluation: {
          indicator: dcd.indicator,
          technique: 'Resolución de problemas contextualizados',
          instrument: 'Rúbrica analítica por criterios de logro',
          rubric: [
            { level: 'Excelente', descriptor: 'Aplica la destreza con precisión metodológica, orden analítico y justificación rigurosa.' },
            { level: 'Satisfactorio', descriptor: 'Resuelve la situación con procedimiento acertado y errores mínimos de cálculo.' },
            { level: 'En proceso', descriptor: 'Requiere acompañamiento docente para interpretar los enunciados y estructurar los pasos.' }
          ]
        }
      };

      this.currentPlan.set(fallbackPlan);
    } finally {
      this.status.set('ready');
    }
  }

  updateStageActivity(stageName: ErcaStage, newActivity: string): void {
    const plan = this.currentPlan();
    if (!plan) return;

    const updatedStages = plan.stages.map((st) =>
      st.stage === stageName ? { ...st, activity: newActivity } : st
    );

    this.currentPlan.set({ ...plan, stages: updatedStages });
  }

  updateStageDua(stageName: ErcaStage, newStrategy: string): void {
    const plan = this.currentPlan();
    if (!plan) return;

    const updatedStages = plan.stages.map((st) =>
      st.stage === stageName ? { ...st, dua: { ...st.dua, strategy: newStrategy } } : st
    );

    this.currentPlan.set({ ...plan, stages: updatedStages });
  }

  updateGuidingQuestion(stageName: ErcaStage, qIndex: number, newQuestion: string): void {
    const plan = this.currentPlan();
    if (!plan) return;

    const updatedStages = plan.stages.map((st) => {
      if (st.stage === stageName && st.guidingQuestions) {
        const updatedQuestions = [...st.guidingQuestions];
        updatedQuestions[qIndex] = newQuestion;
        return { ...st, guidingQuestions: updatedQuestions };
      }
      return st;
    });

    this.currentPlan.set({ ...plan, stages: updatedStages });
  }

  updateInsertionConnection(newText: string): void {
    const plan = this.currentPlan();
    if (!plan) return;

    this.currentPlan.set({
      ...plan,
      header: { ...plan.header, insertionConnection: newText }
    });
  }

  setActiveTab(tab: 'cards' | 'table'): void {
    this.activeTab.set(tab);
  }
}