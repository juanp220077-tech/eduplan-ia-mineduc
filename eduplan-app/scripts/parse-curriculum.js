// eduplan-app/scripts/parse-curriculum.js
const fs = require('fs');
const path = require('path');
const pdfLib = require('pdf-parse');

const baseDir = path.resolve(__dirname, '../../');
const outputPath = path.resolve(__dirname, '../public/data/curriculum-bgu.json');

// Clasificador automático de inserciones curriculares MinEduc
function detectInsertions(text) {
  const t = text.toLowerCase();
  const insertions = [];

  if (/empatía|emoción|emocional|convivencia|diálogo|asertiv|acuerdo|relacion|humano|identidad|respeto|solidar/i.test(t)) {
    insertions.push('CS');
  }
  if (/género|afectiv|sexual|autocuidado|diversidad|derecho|cuerpo|dignidad|inclusión/i.test(t)) {
    insertions.push('EIS');
  }
  if (/ambient|ecolog|sostenib|naturaleza|ecosistema|biodiversidad|recurso|recicl|contamina|clima/i.test(t)) {
    insertions.push('EDS');
  }
  if (/financ|econom|costo|presupuesto|gasto|ahorro|consumo|inversión|moneda|precio/i.test(t)) {
    insertions.push('EF');
  }
  if (/vial|tránsito|riesgo|prevención|seguridad|desastre|emergencia|vulnerab/i.test(t)) {
    insertions.push('EVR');
  }

  if (insertions.length === 0) {
    insertions.push('CS');
  }

  return [...new Set(insertions)];
}

const inicialAmbitosData = [
  {
    id: 'inicial-identidad-autonomia',
    name: 'Ámbito: Identidad y Autonomía',
    topics: [{
      id: 'top-identidad',
      name: 'Eje: Desarrollo Personal y Social',
      dcds: [
        { code: 'EI.IA.1', description: 'Comunicar algunos datos de su identidad como nombre, apellido, edad y nombres de los padres.', indicator: 'I.EI.IA.1 Comunica sus datos personales con claridad.', insertions: ['CS', 'EIS'] },
        { code: 'EI.IA.2', description: 'Demostrar curiosidad por las características físicas de las personas de su entorno familiar y escolar.', indicator: 'I.EI.IA.2 Reconoce rasgos propios y de sus pares.', insertions: ['EIS', 'CS'] },
        { code: 'EI.IA.3', description: 'Practicar hábitos de orden ubicando los objetos y juguetes en el lugar correspondiente.', indicator: 'I.EI.IA.3 Participa autónomamente en rutinas de orden y aseo.', insertions: ['CS'] },
        { code: 'EI.IA.4', description: 'Lavarse las manos, cara y dientes con autonomía siguiendo la secuencia correcta.', indicator: 'I.EI.IA.4 Ejecuta hábitos de higiene personal sin asistencia directa.', insertions: ['EIS'] }
      ]
    }]
  },
  {
    id: 'inicial-convivencia',
    name: 'Ámbito: Convivencia',
    topics: [{
      id: 'top-convivencia',
      name: 'Eje: Desarrollo Personal y Social',
      dcds: [
        { code: 'EI.CV.1', description: 'Participar en juegos grupales siguiendo las reglas y respetando el turno de sus compañeros.', indicator: 'I.EI.CV.1 Se integra armónicamente en actividades colectivas.', insertions: ['CS', 'EVR'] },
        { code: 'EI.CV.2', description: 'Demostrar preferencia por jugar con un niño o niña en específico manteniendo relaciones cordiales.', indicator: 'I.EI.CV.2 Establece vínculos afectivos con pares.', insertions: ['CS', 'EIS'] },
        { code: 'EI.CV.3', description: 'Reconocer a los miembros de su familia e interactuar de forma respetuosa.', indicator: 'I.EI.CV.3 Identifica los roles de los integrantes de su núcleo familiar.', insertions: ['CS', 'EIS'] }
      ]
    }]
  },
  {
    id: 'inicial-medio-natural',
    name: 'Ámbito: Relaciones con el Medio Natural y Cultural',
    topics: [{
      id: 'top-medio-natural',
      name: 'Eje: Descubrimiento del Medio Natural y Cultural',
      dcds: [
        { code: 'EI.RN.1', description: 'Diferenciar entre seres vivos y elementos inertes a través de la exploración sensorial.', indicator: 'I.EI.RN.1 Identifica características básicas de seres vivos en su entorno.', insertions: ['EDS'] },
        { code: 'EI.RN.2', description: 'Reconocer los alimentos nutritivos y no nutritivos identificando los beneficios de una dieta sana.', indicator: 'I.EI.RN.2 Discrimina alimentos saludables.', insertions: ['EIS', 'EDS'] },
        { code: 'EI.RN.3', description: 'Participar en prácticas de cuidado y protección de plantas y animales domésticos.', indicator: 'I.EI.RN.3 Manifiesta conductas de protección ambiental escolar.', insertions: ['EDS', 'CS'] }
      ]
    }]
  },
  {
    id: 'inicial-logico-matematico',
    name: 'Ámbito: Relaciones Lógico-Matemáticas',
    topics: [{
      id: 'top-logico',
      name: 'Eje: Descubrimiento del Medio Natural y Cultural',
      dcds: [
        { code: 'EI.RLM.1', description: 'Ordenar secuencias temporales sencillas con nociones antes, ahora y después.', indicator: 'I.EI.RLM.1 Ubica acontecimientos en orden temporal.', insertions: ['CS'] },
        { code: 'EI.RLM.2', description: 'Reconocer colores primarios y secundarios en elementos del entorno y material didáctico.', indicator: 'I.EI.RLM.2 Clasifica objetos por color, forma y tamaño.', insertions: ['CS'] },
        { code: 'EI.RLM.3', description: 'Contar colecciones de objetos del 1 al 10 en situaciones lúdicas cotidianas.', indicator: 'I.EI.RLM.3 Comprende la noción de cantidad hasta 10.', insertions: ['EF'] },
        { code: 'EI.RLM.4', description: 'Identificar nociones espaciales básicas: arriba/abajo, dentro/fuera, cerca/lejos.', indicator: 'I.EI.RLM.4 Ubica su cuerpo y objetos en el espacio tridimensional.', insertions: ['EVR'] }
      ]
    }]
  },
  {
    id: 'inicial-lenguaje',
    name: 'Ámbito: Comprensión y Expresión del Lenguaje',
    topics: [{
      id: 'top-lenguaje',
      name: 'Eje: Expresión y Comunicación',
      dcds: [
        { code: 'EI.LL.1', description: 'Comunicarse mediante oraciones sencillas expresando ideas, emociones y necesidades.', indicator: 'I.EI.LL.1 Expresa pensamientos utilizando vocabulario comprensible.', insertions: ['CS', 'EIS'] },
        { code: 'EI.LL.2', description: 'Responder a preguntas sobre la trama y personajes principales de un cuento infantil escuchado.', indicator: 'I.EI.LL.2 Demuestra comprensión auditiva de narraciones orales.', insertions: ['CS'] },
        { code: 'EI.LL.3', description: 'Realizar trazos libres y guiados explorando pinza digital y prensión del instrumento gráfico.', indicator: 'I.EI.LL.3 Desarrolla patrones grafomotores preparatorios.', insertions: ['CS'] }
      ]
    }]
  },
  {
    id: 'inicial-arte',
    name: 'Ámbito: Expresión Artística',
    topics: [{
      id: 'top-arte',
      name: 'Eje: Expresión y Comunicación',
      dcds: [
        { code: 'EI.EA.1', description: 'Participar en rondas, cantos y ritmos corporales coordinando movimientos simples.', indicator: 'I.EI.EA.1 Sigue ritmos sonoros con esquemas motores.', insertions: ['CS'] },
        { code: 'EI.EA.2', description: 'Experimentar con técnicas grafoplásticas diversas: trozado, rasgado, dactilopintura y modelado.', indicator: 'I.EI.EA.2 Aplica técnicas artísticas desarrollando la creatividad.', insertions: ['CS', 'EDS'] }
      ]
    }]
  },
  {
    id: 'inicial-corporal-motriz',
    name: 'Ámbito: Expresión Corporal y Motricidad',
    topics: [{
      id: 'top-motriz',
      name: 'Eje: Expresión y Comunicación',
      dcds: [
        { code: 'EI.ECM.1', description: 'Realizar ejercicios de equilibrio dinámico: caminar en línea recta, saltar en un pie y subir gradas.', indicator: 'I.EI.ECM.1 Domina el control postural en desplazamientos.', insertions: ['EVR', 'CS'] },
        { code: 'EI.ECM.2', description: 'Coordinar óculo-visomanual en actividades de ensartado, enhebrado y apilamiento.', indicator: 'I.EI.ECM.2 Evidencia coordinación visomotriz fina.', insertions: ['CS'] }
      ]
    }]
  }
];

const regularLevels = [
  { id: 'preparatoria', name: 'Básica Preparatoria (1.° EGB)', file: '3. preparatoria.pdf' },
  { id: 'elemental', name: 'Básica Elemental (2.°, 3.° y 4.° EGB)', file: '4. elemental.pdf' },
  { id: 'media', name: 'Básica Media (5.°, 6.° y 7.° EGB)', file: '5. media.pdf' },
  { id: 'superior', name: 'Básica Superior (8.°, 9.° y 10.° EGB)', file: '6. superior.pdf' },
  { id: 'bgu', name: 'Bachillerato General Unificado (1.°, 2.° y 3.° BGU)', file: '7. bgu.pdf' }
];

function resolveSubject(code) {
  if (code.startsWith('M.')) return { id: 'matematica', name: 'Matemática', topic: 'Álgebra, Geometría y Estadística' };
  if (code.startsWith('LL.')) return { id: 'lengua', name: 'Lengua y Literatura', topic: 'Lectura, Escritura y Comunicación' };
  if (code.startsWith('CN.F.')) return { id: 'fisica', name: 'Física', topic: 'Movimiento, Fuerzas y Energía' };
  if (code.startsWith('CN.Q.')) return { id: 'quimica', name: 'Química', topic: 'Materia, Átomos y Enlaces' };
  if (code.startsWith('CN.B.')) return { id: 'biologia', name: 'Biología', topic: 'Células, Genética y Biodiversidad' };
  if (code.startsWith('CN.')) return { id: 'ciencias-naturales', name: 'Ciencias Naturales', topic: 'Materia viva y entorno físico' };
  if (code.startsWith('CS.H.')) return { id: 'historia', name: 'Historia', topic: 'Historia y Procesos Sociales' };
  if (code.startsWith('CS.F.')) return { id: 'filosofia', name: 'Filosofía', topic: 'Lógica, Epistemología y Ética' };
  if (code.startsWith('CS.EC.')) return { id: 'ciudadania', name: 'Educación para la Ciudadanía', topic: 'Derechos y Democracia' };
  if (code.startsWith('CS.')) return { id: 'ciencias-sociales', name: 'Estudios Sociales', topic: 'Historia, Espacio y Convivencia' };
  if (code.startsWith('EF.')) return { id: 'educacion-fisica', name: 'Educación Física', topic: 'Prácticas Corporales y Salud' };
  if (code.startsWith('ECA.')) return { id: 'arte', name: 'Educación Cultural y Artística', topic: 'Expresión Artística y Patrimonio' };
  if (code.startsWith('EFL.')) return { id: 'ingles', name: 'Lengua Extranjera (Inglés)', topic: 'Communication and Literacy' };
  return { id: 'general', name: 'Área Integrada', topic: 'Desarrollo de Destrezas' };
}

// Función para limpiar la descripción y cortar cualquier indicador o destreza colada
function cleanDcdDescription(rawText) {
  let cleaned = rawText.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();

  // Cortar si empieza un indicador oficial como I.M.5..., I.LL..., I.CN..., etc.
  const indicatorCut = cleaned.search(/\s+(?:I\.[A-Z]{1,3}\.(?:[A-Z]\.)?[0-9]\.[0-9]+|CE\.[A-Z]|CRITERIO)/i);
  if (indicatorCut !== -1) {
    cleaned = cleaned.substring(0, indicatorCut).trim();
  }

  // Cortar si se coló otra destreza consecutiva tipo "M.5.1.22" dentro del mismo texto
  const nextDcdCut = cleaned.search(/\s+(?:[A-Z]{1,3}\.(?:[A-Z]\.)?[0-9]\.[0-9]\.[0-9]+)\.?\s+[A-ZÁÉÍÓÚ]/);
  if (nextDcdCut !== -1) {
    cleaned = cleaned.substring(0, nextDcdCut).trim();
  }

  // Eliminar restos de paréntesis de codificación ministerial final si quedaron sueltos
  cleaned = cleaned.replace(/\s*\([I0-9,\.\s-]+\)\s*$/, '').trim();

  return cleaned;
}

async function extractPdfText(buffer) {
  if (typeof pdfLib === 'function') {
    const res = await pdfLib(buffer);
    return res.text;
  }
  if (pdfLib.default && typeof pdfLib.default === 'function') {
    const res = await pdfLib.default(buffer);
    return res.text;
  }
  if (pdfLib.PDFParser) {
    const parser = new pdfLib.PDFParser();
    const data = await parser.parseBuffer(buffer);
    return data.text || '';
  }
  throw new Error('Error invocando motor pdf-parse.');
}

async function main() {
  const finalCatalog = [];

  // 1. Nivel Inicial con sus ámbitos
  finalCatalog.push({
    id: 'inicial',
    name: 'Educación Inicial (3 a 5 años)',
    subjects: inicialAmbitosData
  });
  console.log(`✓ Registrados los 7 Ámbitos oficiales para Inicial.`);

  // 2. Expresión regular con tope estricto ante indicadores (I.) o criterios (CE.)
  const dcdRegex = /([A-Z]{1,3}\.(?:[A-Z]\.)?[0-9]\.[0-9]\.[0-9]+)\.?\s+([^\n\r]+(?:\n[^\n\r]+)*?)(?=(?:[A-Z]{1,3}\.(?:[A-Z]\.)?[0-9]\.[0-9]\.[0-9]+|I\.[A-Z]|CE\.[A-Z]|$))/g;

  for (const lvl of regularLevels) {
    const filePath = path.join(baseDir, lvl.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Omitido] No existe: ${lvl.file}`);
      continue;
    }

    try {
      const buffer = fs.readFileSync(filePath);
      const text = await extractPdfText(buffer);
      const subjectsMap = {};
      let match;
      let count = 0;

      while ((match = dcdRegex.exec(text)) !== null) {
        const code = match[1].trim();

        // Evitar que capture códigos que en realidad son indicadores (I.M.5..., I.LL..., etc.)
        if (code.startsWith('I.') || code.startsWith('CE.')) {
          continue;
        }

        const rawDescription = match[2];
        const description = cleanDcdDescription(rawDescription);

        // Si la descripción quedó vacía o demasiado corta (< 10 caracteres), ignorar
        if (!description || description.length < 10) {
          continue;
        }

        const subInfo = resolveSubject(code);
        const insertions = detectInsertions(description);

        if (!subjectsMap[subInfo.id]) {
          subjectsMap[subInfo.id] = {
            id: `${lvl.id}-${subInfo.id}`,
            name: subInfo.name,
            topics: [{
              id: `${lvl.id}-${subInfo.id}-bloque`,
              name: subInfo.topic,
              dcds: []
            }]
          };
        }

        // Evitar duplicados del mismo código
        const exists = subjectsMap[subInfo.id].topics[0].dcds.some(d => d.code === code);
        if (!exists) {
          subjectsMap[subInfo.id].topics[0].dcds.push({
            code: code,
            description: description,
            indicator: `Indicador oficial evaluable para [${code}].`,
            insertions: insertions
          });
          count++;
        }
      }

      console.log(`✓ Extraídas ${count} DCDs limpias para ${lvl.name}`);
      finalCatalog.push({
        id: lvl.id,
        name: lvl.name,
        subjects: Object.values(subjectsMap)
      });
    } catch (e) {
      console.error(`Error procesando ${lvl.file}:`, e.message);
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalCatalog, null, 2), 'utf-8');
  console.log(`\nBase curricular limpia y delimitada generada en: ${outputPath}`);
}

main();