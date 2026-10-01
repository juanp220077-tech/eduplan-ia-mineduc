import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningService } from '../services/planning.service';
import { DocumentExportService } from '../services/document-export.service';
import { ErcaStage, CurricularInsertionInfo } from '../models/lesson-plan.model';

@Component({
  selector: 'app-workspace-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Barra superior de pestañas y acciones -->
      <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div class="flex gap-2">
          <button
            (click)="planningService.setActiveTab('cards')"
            [class.bg-slate-900]="planningService.activeTab() === 'cards'"
            [class.text-white]="planningService.activeTab() === 'cards'"
            [class.text-slate-700]="planningService.activeTab() !== 'cards'"
            [class.bg-slate-100]="planningService.activeTab() !== 'cards'"
            class="px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm">
            Vista Didáctica (Tarjetas ERCA)
          </button>
          <button
            (click)="planningService.setActiveTab('table')"
            [class.bg-slate-900]="planningService.activeTab() === 'table'"
            [class.text-white]="planningService.activeTab() === 'table'"
            [class.text-slate-700]="planningService.activeTab() !== 'table'"
            [class.bg-slate-100]="planningService.activeTab() !== 'table'"
            class="px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm">
            {{ isInicial() ? 'Vista Oficial MinEduc (Ámbitos)' : 'Vista Oficial MinEduc (Tabla)' }}
          </button>
        </div>

        <div class="flex gap-2" *ngIf="planningService.hasPlan()">
          <button
            (click)="exportToWord()"
            class="px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1.5 shadow-sm">
            <span>Descargar Word (.docx)</span>
          </button>
          
          <button
            (click)="copyToClipboard()"
            class="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition text-slate-700 flex items-center gap-1.5">
            <span>{{ copied ? '¡Copiado!' : 'Copiar Texto' }}</span>
          </button>
          
          <button
            (click)="printPlan()"
            class="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow-sm">
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      <!-- Estado vacío -->
      <div *ngIf="!planningService.hasPlan() && !planningService.isGenerating()" class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
        <p class="text-sm font-medium">Selecciona una Destreza en el panel izquierdo y presiona "Estructurar Microplanificación Didáctica".</p>
      </div>

      <!-- Spinner de carga -->
      <div *ngIf="planningService.isGenerating()" class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-600 space-y-3">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-sm font-semibold">Generando ERCA, DUA e integrando inserciones curriculares MinEduc...</p>
      </div>

      <!-- CONTENIDO ACTIVO -->
      <div *ngIf="planningService.hasPlan() && !planningService.isGenerating()">
        
        <!-- PESTAÑA 1: VISTA DIDÁCTICA (TARJETAS ERCA) -->
        <div *ngIf="planningService.activeTab() === 'cards'" class="space-y-4">
          
          <!-- Banner de Inserciones Curriculares Identificadas -->
          <div class="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/70 p-3.5 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-700">Inserciones Curriculares:</span>
              <div class="flex items-center gap-1.5">
                <span 
                  *ngFor="let ins of getInsertionBadges()" 
                  [ngClass]="ins.color"
                  [title]="ins.name"
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-[10px] shadow-sm border cursor-help">
                  {{ ins.symbol }}
                </span>
              </div>
            </div>
            <div class="text-xs text-slate-600 italic flex-1 ml-4 border-l border-slate-300 pl-3">
              <span contenteditable="true" (blur)="onInsertionEdit($event)" class="outline-none hover:bg-white/60 rounded px-1 cursor-text">
                {{ planningService.currentPlan()?.header?.insertionConnection }}
              </span>
            </div>
          </div>

          <div *ngFor="let stage of planningService.currentPlan()?.stages" class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-shadow hover:shadow">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span [ngClass]="getBadgeClass(stage.stage)" class="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded">
                  {{ stage.stage }}
                </span>
                <h3 class="text-sm font-bold text-slate-800">{{ stage.title }}</h3>
              </div>
              <span class="text-xs font-medium text-slate-400">{{ stage.durationMinutes }} min</span>
            </div>

            <!-- Actividad Mediada Editable -->
            <div class="mb-3">
              <label class="block text-[11px] font-medium text-slate-400 mb-1">Actividad mediada (clic para editar):</label>
              <div
                contenteditable="true"
                (blur)="onActivityEdit(stage.stage, $event)"
                class="text-xs leading-relaxed text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white outline-none transition-colors cursor-text">
                {{ stage.activity }}
              </div>
            </div>

            <!-- Preguntas Orientadoras Editables -->
            <div *ngIf="stage.guidingQuestions?.length" class="mb-3 pl-3 border-l-2 border-slate-200 space-y-1.5">
              <span class="block text-[11px] font-medium text-slate-400">Preguntas Mediadoras (clic para editar):</span>
              <ul class="list-disc pl-4 space-y-1 text-xs text-slate-700">
                <li *ngFor="let q of stage.guidingQuestions; let qi = index">
                  <span
                    contenteditable="true"
                    (blur)="onQuestionEdit(stage.stage, qi, $event)"
                    class="outline-none hover:bg-slate-100 rounded px-1 cursor-text">
                    {{ q }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Estrategia DUA Editable -->
            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2.5">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-200 text-emerald-900 uppercase tracking-wide">
                DUA
              </span>
              <div class="text-xs text-emerald-950 flex-1">
                <strong class="font-semibold text-emerald-900">{{ stage.dua.title }}:</strong>
                <p
                  contenteditable="true"
                  (blur)="onDuaEdit(stage.stage, $event)"
                  title="Haz clic para personalizar esta estrategia DUA"
                  class="mt-0.5 p-1 rounded outline-none hover:bg-emerald-100/60 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors cursor-text">
                  {{ stage.dua.strategy }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA 2: VISTA OFICIAL MINEDUC (CON SELLOS ICONOGRÁFICOS) -->
        <div *ngIf="planningService.activeTab() === 'table'" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto print:p-0 print:border-none">
          <div class="text-center mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wide text-slate-900">{{ planningService.currentPlan()?.header?.institution }}</h2>
            <h3 class="text-xs font-semibold uppercase text-slate-600">
              {{ isInicial() ? 'Planificación de la Experiencia de Aprendizaje (Educación Inicial)' : 'Planificación Microcurricular de Aula' }}
            </h3>
          </div>

          <!-- Encabezado Informativo Oficial -->
          <table class="w-full text-xs border-collapse border border-slate-300">
            <tbody>
              <tr class="bg-slate-50">
                <td class="border border-slate-300 p-2 font-bold w-1/4">Docente:</td>
                <td class="border border-slate-300 p-2">{{ planningService.currentPlan()?.header?.teacher }}</td>
                <td class="border border-slate-300 p-2 font-bold w-1/4">
                  {{ isInicial() ? 'Ámbito de Desarrollo:' : 'Área / Asignatura:' }}
                </td>
                <td class="border border-slate-300 p-2">{{ planningService.currentPlan()?.header?.subject }}</td>
              </tr>
              <tr class="bg-slate-50">
                <td class="border border-slate-300 p-2 font-bold">
                  {{ isInicial() ? 'Grupo de Edad:' : 'Grado/Curso:' }}
                </td>
                <td class="border border-slate-300 p-2">{{ planningService.currentPlan()?.header?.gradeLevel }} '{{ planningService.currentPlan()?.header?.parallel }}'</td>
                <td class="border border-slate-300 p-2 font-bold">Tiempo / Períodos:</td>
                <td class="border border-slate-300 p-2">
                  {{ planningService.currentPlan()?.header?.periods }} Período(s) 
                  ({{ (planningService.currentPlan()?.header?.periods || 1) * (planningService.currentPlan()?.header?.periodDuration || 40) }} min totales)
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Matriz Didáctica Central -->
          <table class="w-full text-xs border-collapse border border-slate-300 mt-4">
            <thead>
              <tr class="bg-slate-100 text-left font-bold text-slate-800">
                <th class="border border-slate-300 p-2.5 w-1/4">
                  {{ isInicial() ? 'DESTREZAS POR ÁMBITO' : 'DESTREZAS CON CRITERIOS DE DESEMPEÑO' }}
                </th>
                <th class="border border-slate-300 p-2.5 w-1/2">ESTRATEGIAS METODOLÓGICAS ACTIVAS (ERCA + DUA)</th>
                <th class="border border-slate-300 p-2.5 w-1/4">ACTIVIDADES EVALUATIVAS</th>
              </tr>
            </thead>
            <tbody class="align-top">
              <tr>
                <!-- Destreza con Iconografía oficial -->
                <td class="border border-slate-300 p-2.5">
                  <div class="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <strong class="text-slate-900">[{{ planningService.currentPlan()?.header?.dcdCode }}]</strong>
                    <!-- Sellos Circulares de Inserción -->
                    <span 
                      *ngFor="let ins of getInsertionBadges()" 
                      [ngClass]="ins.color"
                      [title]="ins.name"
                      class="inline-flex items-center justify-center w-5 h-5 rounded-full font-black text-[9px] shadow-sm border cursor-help">
                      {{ ins.symbol }}
                    </span>
                  </div>
                  <p class="text-slate-700 leading-relaxed">{{ planningService.currentPlan()?.header?.dcdText }}</p>

                  <div *ngIf="planningService.currentPlan()?.header?.insertionConnection" class="mt-2.5 p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                    <strong class="text-slate-800 block">Inserción Curricular:</strong>
                    {{ planningService.currentPlan()?.header?.insertionConnection }}
                  </div>
                </td>

                <!-- ERCA + DUA -->
                <td class="border border-slate-300 p-2.5 space-y-3">
                  <div *ngFor="let stage of planningService.currentPlan()?.stages">
                    <strong class="uppercase text-slate-900 block text-[11px]">
                      {{ stage.stage }} ({{ stage.durationMinutes }} min):
                    </strong>
                    <p class="text-slate-700 mt-0.5">{{ stage.activity }}</p>

                    <ul *ngIf="stage.guidingQuestions?.length" class="list-disc pl-4 text-slate-600 mt-1 space-y-0.5 text-[11px]">
                      <li *ngFor="let q of stage.guidingQuestions">{{ q }}</li>
                    </ul>

                    <p class="text-emerald-800 mt-1 italic text-[11px] bg-emerald-50/60 p-1 rounded">
                      <strong>Adaptación DUA:</strong> {{ stage.dua.strategy }}
                    </p>
                  </div>
                </td>

                <!-- Evaluación -->
                <td class="border border-slate-300 p-2.5 space-y-2">
                  <div>
                    <strong class="block text-slate-900">Indicador:</strong>
                    <p class="text-slate-700 mt-0.5">{{ planningService.currentPlan()?.evaluation?.indicator }}</p>
                  </div>
                  <div>
                    <strong class="block text-slate-900">Técnica / Instrumento:</strong>
                    <p class="text-slate-700 mt-0.5">
                      {{ planningService.currentPlan()?.evaluation?.technique }} /
                      {{ planningService.currentPlan()?.evaluation?.instrument }}
                    </p>
                  </div>
                  <div *ngIf="planningService.currentPlan()?.evaluation?.rubric?.length">
                    <strong class="block text-slate-900 mb-1">Escala de Logro:</strong>
                    <ul class="space-y-1 text-[11px]">
                      <li *ngFor="let r of planningService.currentPlan()?.evaluation?.rubric" class="p-1 rounded bg-slate-50 border border-slate-200">
                        <strong class="text-slate-800">{{ r.level }}:</strong> {{ r.descriptor }}
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class WorkspacePanelComponent {
  readonly planningService = inject(PlanningService);
  private readonly documentExportService = inject(DocumentExportService);

  copied = false;

  // Mapa oficial de Inserciones Curriculares MinEduc
  private readonly insertionCatalog: Record<string, CurricularInsertionInfo> = {
    'CS': { code: 'CS', name: 'Competencia Socioemocional', color: 'bg-amber-400 text-slate-950 border-amber-500', symbol: 'CS' },
    'EIS': { code: 'EIS', name: 'Educación Integral en Sexualidad / Afectividad', color: 'bg-purple-600 text-white border-purple-700', symbol: '♥' },
    'EDS': { code: 'EDS', name: 'Desarrollo Sostenible / Ambiental', color: 'bg-emerald-600 text-white border-emerald-700', symbol: '🌱' },
    'EF': { code: 'EF', name: 'Educación Financiera', color: 'bg-blue-600 text-white border-blue-700', symbol: '$' },
    'EVR': { code: 'EVR', name: 'Gestión de Riesgos y Educación Vial', color: 'bg-rose-600 text-white border-rose-700', symbol: '▲' }
  };

  getInsertionBadges(): CurricularInsertionInfo[] {
    const codes = this.planningService.currentPlan()?.header?.insertions || ['CS'];
    return codes.map(c => this.insertionCatalog[c] || this.insertionCatalog['CS']);
  }

  isInicial(): boolean {
    const level = this.planningService.currentPlan()?.header?.gradeLevel || '';
    return level.toLowerCase().includes('inicial');
  }

  getBadgeClass(stage: ErcaStage): string {
    switch (stage) {
      case 'experiencia': return 'bg-amber-100 text-amber-800';
      case 'reflexion': return 'bg-indigo-100 text-indigo-800';
      case 'conceptualizacion': return 'bg-sky-100 text-sky-800';
      case 'aplicacion': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  onActivityEdit(stage: ErcaStage, event: FocusEvent) {
    const text = (event.target as HTMLElement).innerText.trim();
    this.planningService.updateStageActivity(stage, text);
  }

  onDuaEdit(stage: ErcaStage, event: FocusEvent) {
    const text = (event.target as HTMLElement).innerText.trim();
    this.planningService.updateStageDua(stage, text);
  }

  onQuestionEdit(stage: ErcaStage, qIndex: number, event: FocusEvent) {
    const text = (event.target as HTMLElement).innerText.trim();
    this.planningService.updateGuidingQuestion(stage, qIndex, text);
  }

  onInsertionEdit(event: FocusEvent) {
    const text = (event.target as HTMLElement).innerText.trim();
    this.planningService.updateInsertionConnection(text);
  }

  exportToWord() {
    const plan = this.planningService.currentPlan();
    if (plan) {
      this.documentExportService.exportToWord(plan);
    }
  }

  copyToClipboard() {
    const plan = this.planningService.currentPlan();
    if (!plan) return;

    let text = `PLANIFICACIÓN MICROCURRICULAR - ${plan.header.institution}\n`;
    text += `Docente: ${plan.header.teacher} | Asignatura/Ámbito: ${plan.header.subject}\n`;
    text += `DCD: [${plan.header.dcdCode}] ${plan.header.dcdText}\n`;
    text += `Inserciones Curriculares: ${plan.header.insertions?.join(', ')} - ${plan.header.insertionConnection}\n\n`;
    text += `SECUENCIA METODOLÓGICA (ERCA + DUA):\n`;

    plan.stages.forEach(st => {
      text += `\n[${st.stage.toUpperCase()}] ${st.title} (${st.durationMinutes} min):\n`;
      text += `Actividad: ${st.activity}\n`;
      if (st.guidingQuestions?.length) {
        text += `Preguntas: \n - ${st.guidingQuestions.join('\n - ')}\n`;
      }
      text += `DUA (${st.dua.title}): ${st.dua.strategy}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2500);
    });
  }

  printPlan() {
    window.print();
  }
}