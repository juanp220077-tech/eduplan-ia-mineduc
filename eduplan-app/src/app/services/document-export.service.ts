import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { LessonPlan } from '../models/lesson-plan.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentExportService {

  exportToWord(plan: LessonPlan): void {
    const isInicial = plan.header.gradeLevel.toLowerCase().includes('inicial');
    const areaLabel = isInicial ? 'Ámbito de Desarrollo:' : 'Área / Asignatura:';
    const destrezaLabel = isInicial ? 'DESTREZAS POR ÁMBITO' : 'DESTREZAS CON CRITERIOS DE DESEMPEÑO';

    const duracionUnitaria = plan.header.periodDuration || 40;
    const totalMinutos = (plan.header.periods || 1) * duracionUnitaria;
    const insercionesTexto = plan.header.insertions?.join(', ') || 'CS';

    // Generar párrafos para el ciclo ERCA + DUA
    const sequenceParagraphs: Paragraph[] = [];
    plan.stages.forEach(st => {
      sequenceParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${st.stage.toUpperCase()} (${st.durationMinutes} MIN):`, bold: true, size: 18 })
          ],
          spacing: { before: 120, after: 40 }
        }),
        new Paragraph({
          children: [new TextRun({ text: st.activity, size: 18 })],
          spacing: { after: 60 }
        })
      );

      if (st.guidingQuestions?.length) {
        st.guidingQuestions.forEach(q => {
          sequenceParagraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${q}`, size: 17, italics: true })],
              spacing: { after: 30 }
            })
          );
        });
      }

      sequenceParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Adaptación DUA (${st.dua.title}): `, bold: true, italics: true, size: 17 }),
            new TextRun({ text: st.dua.strategy, italics: true, size: 17 })
          ],
          spacing: { after: 120 }
        })
      );
    });

    // Párrafos para Evaluación
    const evaluationParagraphs: Paragraph[] = [
      new Paragraph({
        children: [new TextRun({ text: 'Indicador de Evaluación:', bold: true, size: 18 })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: plan.evaluation.indicator, size: 18 })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Técnica e Instrumento:', bold: true, size: 18 })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `${plan.evaluation.technique} / ${plan.evaluation.instrument}`, size: 18 })],
        spacing: { after: 100 }
      })
    ];

    if (plan.evaluation.rubric?.length) {
      evaluationParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Rúbrica de Criterios:', bold: true, size: 18 })],
          spacing: { after: 40 }
        })
      );
      plan.evaluation.rubric.forEach(r => {
        evaluationParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `• ${r.level}: `, bold: true, size: 16 }),
              new TextRun({ text: r.descriptor, size: 16 })
            ],
            spacing: { after: 40 }
          })
        );
      });
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 }
          }
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: plan.header.institution.toUpperCase(), bold: true, size: 24 })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({ 
                text: isInicial ? 'PLANIFICACIÓN MICROCURRICULAR POR ÁMBITOS - EDUCACIÓN INICIAL' : 'PLANIFICACIÓN MICROCURRICULAR DE AULA', 
                bold: true, 
                size: 20, 
                color: '4A5568' 
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          // Tabla Informativa
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Docente:', bold: true, size: 18 })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: plan.header.teacher, size: 18 })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: areaLabel, bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: plan.header.subject, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Grado/Grupo:', bold: true, size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${plan.header.gradeLevel} "${plan.header.parallel}"`, size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tiempo / Períodos:', bold: true, size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${plan.header.periods} Período(s) (${totalMinutos} min totales)`, size: 18 })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 150 } }),

          // Tabla Matriz Curricular
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: destrezaLabel, bold: true, size: 18 })] })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'ESTRATEGIAS METODOLÓGICAS ACTIVAS (ERCA + DUA)', bold: true, size: 18 })] })],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'ACTIVIDADES EVALUATIVAS', bold: true, size: 18 })] })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: `[${plan.header.dcdCode}]`, bold: true, size: 18 })] }),
                      new Paragraph({ children: [new TextRun({ text: `Inserciones Curriculares: [${insercionesTexto}]`, bold: true, italics: true, size: 16, color: 'B45309' })], spacing: { before: 40, after: 40 } }),
                      new Paragraph({ children: [new TextRun({ text: plan.header.dcdText, size: 18 })], spacing: { before: 40 } }),
                      new Paragraph({ children: [new TextRun({ text: `Articulación: ${plan.header.insertionConnection || ''}`, italics: true, size: 16, color: '4B5563' })], spacing: { before: 80 } })
                    ]
                  }),
                  new TableCell({ children: sequenceParagraphs }),
                  new TableCell({ children: evaluationParagraphs })
                ]
              })
            ]
          })
        ]
      }]
    });

    const fileName = `Planificacion_${plan.header.dcdCode.replace(/\./g, '_')}_${plan.header.teacher.replace(/\s+/g, '_')}.docx`;
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, fileName);
    });
  }
}