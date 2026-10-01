import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurricularLevel } from '../models/lesson-plan.model';

@Injectable({
  providedIn: 'root'
})
export class CurriculumDataService {
  private readonly http = inject(HttpClient);

  readonly levels = signal<CurricularLevel[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadCurriculum();
  }

  loadCurriculum(): void {
    this.isLoading.set(true);
    // Carga directa desde public/data/curriculum-bgu.json
    this.http.get<CurricularLevel[]>('data/curriculum-bgu.json').subscribe({
      next: (data) => {
        this.levels.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback por si la ruta base es absoluta
        this.http.get<CurricularLevel[]>('/data/curriculum-bgu.json').subscribe({
          next: (data) => {
            this.levels.set(data || []);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error cargando curriculum-bgu.json:', err);
            this.error.set('No se pudo cargar el archivo curricular.');
            this.isLoading.set(false);
          }
        });
      }
    });
  }
}