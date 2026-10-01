// src/app/components/curriculum-form.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningService } from '../services/planning.service';
import { CurriculumDataService } from '../services/curriculum-data.service';
import {
  CurricularLevel,
  CurricularSubject,
  CurricularTopic,
  CurricularDcd
} from '../models/lesson-plan.model';

@Component({
  selector: 'app-curriculum-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h2 class="text-base font-semibold text-slate-800">Parámetros Curriculares</h2>
          <p class="text-xs text-slate-500">Catálogo Oficial MinEduc Ecuador</p>
        </div>
        <span *ngIf="curriculumService.isLoading()" class="text-xs text-blue-600 font-medium animate-pulse">
          Cargando catálogo...
        </span>
      </div>

      <div class="space-y-3 text-xs">
        <!-- 1. Subnivel -->
        <div>
          <label for="subnivel-select" class="block font-medium text-slate-700 mb-1">1. Subnivel Educativo</label>
          <select 
            id="subnivel-select"
            name="subnivel"
            [(ngModel)]="selectedLevelId" 
            (ngModelChange)="onLevelChange()"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none">
            <option value="" disabled>Seleccione un nivel...</option>
            <option *ngFor="let lvl of curriculumService.levels()" [value]="lvl.id">{{ lvl.name }}</option>
          </select>
        </div>

        <!-- 2. Asignatura o Ámbito -->
        <div>
          <label for="materia-select" class="block font-medium text-slate-700 mb-1">
            {{ selectedLevelId === 'inicial' ? '2. Ámbito de Desarrollo y Aprendizaje' : '2. Asignatura' }}
          </label>
          <select 
            id="materia-select"
            name="materia"
            [(ngModel)]="selectedSubjectId" 
            (ngModelChange)="onSubjectChange()"
            [disabled]="!selectedLevel"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100 disabled:text-slate-400">
            <option value="" disabled>
              {{ selectedLevelId === 'inicial' ? 'Seleccione un ámbito...' : 'Seleccione una asignatura...' }}
            </option>
            <option *ngFor="let sub of availableSubjects" [value]="sub.id">{{ sub.name }}</option>
          </select>
        </div>

        <!-- 3. Eje o Bloque Curricular -->
        <div>
          <label for="bloque-select" class="block font-medium text-slate-700 mb-1">
            {{ selectedLevelId === 'inicial' ? '3. Eje de Desarrollo' : '3. Bloque Curricular / Unidad Temática' }}
          </label>
          <select 
            id="bloque-select"
            name="bloque"
            [(ngModel)]="selectedTopicId" 
            (ngModelChange)="onTopicChange()"
            [disabled]="!selectedSubject"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100 disabled:text-slate-400">
            <option value="" disabled>Seleccione una opción...</option>
            <option *ngFor="let top of availableTopics" [value]="top.id">{{ top.name }}</option>
          </select>
        </div>

        <!-- 4. Destreza DCD con Buscador -->
        <div>
          <label for="destreza-search" class="block font-medium text-slate-700 mb-1">
            {{ selectedLevelId === 'inicial' ? '4. Destreza por Ámbito' : '4. DCD Oficial (Destreza Codificada)' }}
          </label>
          <input 
            id="destreza-search"
            name="destrezaSearch"
            type="text" 
            [(ngModel)]="dcdSearchTerm" 
            placeholder="🔍 Filtrar destrezas por código o palabra clave..."
            [disabled]="!selectedTopic"
            class="w-full mb-1.5 px-2.5 py-1.5 rounded border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
          />
          <select 
            id="destreza-select"
            name="destreza"
            [(ngModel)]="selectedDcdCode" 
            (ngModelChange)="onDcdChange()"
            [disabled]="!selectedTopic"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100 disabled:text-slate-400">
            <option value="" disabled>Seleccione la destreza a desarrollar...</option>
            <option *ngFor="let d of filteredDcds" [value]="d.code">
              [{{ d.code }}] {{ d.description }}
            </option>
          </select>
        </div>

        <!-- Metadatos de la clase -->
        <div class="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div>
            <label for="docente-input" class="block font-medium text-slate-700 mb-1">Docente Responsable</label>
            <input 
              id="docente-input"
              name="docente"
              [(ngModel)]="teacherName" 
              type="text" 
              class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label for="paralelo-input" class="block font-medium text-slate-700 mb-1">Paralelo</label>
            <input 
              id="paralelo-input"
              name="paralelo"
              [(ngModel)]="parallel" 
              type="text" 
              placeholder="Paralelo (ej. A)" 
              class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 outline-none"
            />
          </div>
        </div>

        <!-- Selector de Períodos y Horas Pedagógicas (40, 45 y 50 min) -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="periodos-input" class="block font-medium text-slate-700 mb-1">N.° Períodos</label>
            <input 
              id="periodos-input"
              name="periodos"
              [(ngModel)]="periods" 
              type="number" 
              min="1" 
              max="6" 
              class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 outline-none"
            />
          </div>
          <div>
            <label for="duracion-select" class="block font-medium text-slate-700 mb-1">Hora Pedagógica</label>
            <select 
              id="duracion-select"
              name="duracion"
              [(ngModel)]="periodDuration" 
              class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white outline-none">
              <option [ngValue]="40">40 min</option>
              <option [ngValue]="45">45 min</option>
              <option [ngValue]="50">50 min</option>
            </select>
          </div>
        </div>
      </div>

      <button
        (click)="generatePlan()"
        [disabled]="!selectedDcd || planningService.isGenerating()"
        class="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow flex items-center justify-center gap-2">
        <span *ngIf="planningService.isGenerating()" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
        <span>{{ planningService.isGenerating() ? 'Estructurando con ERCA y DUA...' : 'Estructurar Microplanificación Didáctica' }}</span>
      </button>
    </div>
  `
})
export class CurriculumFormComponent {
  readonly planningService = inject(PlanningService);
  readonly curriculumService = inject(CurriculumDataService);

  selectedLevelId = '';
  selectedSubjectId = '';
  selectedTopicId = '';
  selectedDcdCode = '';
  dcdSearchTerm = '';

  teacherName = 'Docente Responsable';
  parallel = 'A';
  periods = 2;
  periodDuration = 40; // 40, 45 o 50 min

  selectedLevel: CurricularLevel | null = null;
  selectedSubject: CurricularSubject | null = null;
  selectedTopic: CurricularTopic | null = null;
  selectedDcd: CurricularDcd | null = null;

  get availableSubjects(): CurricularSubject[] {
    return this.selectedLevel?.subjects || [];
  }

  get availableTopics(): CurricularTopic[] {
    return this.selectedSubject?.topics || [];
  }

  get availableDcds(): CurricularDcd[] {
    return this.selectedTopic?.dcds || [];
  }

  get filteredDcds(): CurricularDcd[] {
    if (!this.dcdSearchTerm.trim()) {
      return this.availableDcds;
    }
    const term = this.dcdSearchTerm.toLowerCase();
    return this.availableDcds.filter(d =>
      d.code.toLowerCase().includes(term) || d.description.toLowerCase().includes(term)
    );
  }

  onLevelChange() {
    this.selectedLevel = this.curriculumService.levels().find(l => l.id === this.selectedLevelId) || null;
    this.selectedSubjectId = '';
    this.selectedTopicId = '';
    this.selectedDcdCode = '';
    this.selectedSubject = null;
    this.selectedTopic = null;
    this.selectedDcd = null;
  }

  onSubjectChange() {
    this.selectedSubject = this.availableSubjects.find(s => s.id === this.selectedSubjectId) || null;
    this.selectedTopicId = '';
    this.selectedDcdCode = '';
    this.selectedTopic = null;
    this.selectedDcd = null;
  }

  onTopicChange() {
    this.selectedTopic = this.availableTopics.find(t => t.id === this.selectedTopicId) || null;
    this.selectedDcdCode = '';
    this.selectedDcd = null;
  }

  onDcdChange() {
    this.selectedDcd = this.availableDcds.find(d => d.code === this.selectedDcdCode) || null;
  }

  generatePlan() {
    if (!this.selectedLevel || !this.selectedSubject || !this.selectedTopic || !this.selectedDcd) return;

    this.planningService.generateFromCurriculum({
      institution: 'Unidad Educativa Experimental',
      teacher: this.teacherName,
      subject: this.selectedSubject.name,
      gradeLevel: this.selectedLevel.name,
      parallel: this.parallel,
      week: 'Semana Actual',
      periods: this.periods,
      periodDuration: this.periodDuration,
      topic: this.selectedTopic.name,
      dcdCode: this.selectedDcd.code,
      dcdText: this.selectedDcd.description
    }, this.selectedDcd);
  }
}