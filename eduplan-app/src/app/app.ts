import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumFormComponent } from './components/curriculum-form.component';
import { WorkspacePanelComponent } from './components/workspace-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CurriculumFormComponent, WorkspacePanelComponent],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col font-sans">
      <!-- Cabecera Institucional -->
      <header class="no-print bg-slate-900 text-white px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow">
            EP
          </div>
          <div>
            <h1 class="text-sm font-semibold tracking-wide leading-tight">EduPlan ERCA/DUA</h1>
            <p class="text-[11px] text-slate-400">Generador de Microplanificación Curricular · Estándar MinEduc Ecuador</p>
          </div>
        </div>
        <div class="text-[11px] text-slate-400 border border-slate-700 px-2.5 py-1 rounded-md">
          PoC v1.0
        </div>
      </header>

      <!-- Layout Split (Dos Columnas) -->
      <main class="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        <section class="no-print md:col-span-4 h-full">
          <app-curriculum-form></app-curriculum-form>
        </section>
        <section class="md:col-span-8 h-full">
          <app-workspace-panel></app-workspace-panel>
        </section>
      </main>
    </div>
  `
})
export class App {}