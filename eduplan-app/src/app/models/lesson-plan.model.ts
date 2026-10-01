export type ErcaStage = 'experiencia' | 'reflexion' | 'conceptualizacion' | 'aplicacion';

export interface DuaStrategy {
  principle: 'implicacion' | 'representacion' | 'accion_expresion';
  title: string;
  strategy: string;
}

export interface ErcaCardData {
  stage: ErcaStage;
  title: string;
  durationMinutes: number;
  activity: string;
  guidingQuestions?: string[];
  keyConcepts?: string[];
  resources: string[];
  dua: DuaStrategy;
}

export interface RubricLevel {
  level: 'Excelente' | 'Satisfactorio' | 'En proceso';
  descriptor: string;
}

export interface CurricularInsertionInfo {
  code: 'CS' | 'EIS' | 'EDS' | 'EF' | 'EVR';
  name: string;
  color: string;
  symbol: string;
}

export interface EvaluationData {
  indicator: string;
  technique: string;
  instrument: string;
  rubric: RubricLevel[];
}

export interface LessonPlanHeader {
  institution: string;
  teacher: string;
  subject: string;
  gradeLevel: string;
  parallel: string;
  week: string;
  periods?: number;
  periodDuration?: number; // 40 o 45 minutos
  topic: string;
  dcdCode: string;
  dcdText: string;
  insertions?: string[]; // Códigos de inserción ej: ['CS', 'EIS']
  insertionConnection?: string; // Explicación pedagógica de la inserción
}

export interface LessonPlan {
  header: LessonPlanHeader;
  stages: ErcaCardData[];
  evaluation: EvaluationData;
}

export interface CurricularDcd {
  code: string;
  description: string;
  indicator: string;
  insertions?: string[];
}

export interface CurricularTopic {
  id: string;
  name: string;
  dcds: CurricularDcd[];
}

export interface CurricularSubject {
  id: string;
  name: string;
  topics: CurricularTopic[];
}

export interface CurricularLevel {
  id: string;
  name: string;
  subjects: CurricularSubject[];
}