"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantFlow = exports.assistantOutputSchema = exports.assistantInputSchema = void 0;
const zod_1 = require("zod");
const genkit_1 = require("../genkit");
const firebase_admin_1 = require("../firebase-admin");
const MessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'assistant']),
    text: zod_1.z.string(),
});
const ChartSeriesSchema = zod_1.z.object({
    key: zod_1.z.string(),
    label: zod_1.z.string(),
});
const ChartSchema = zod_1.z.object({
    type: zod_1.z.enum(['bar', 'line', 'pie']),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    xKey: zod_1.z.string().optional(),
    data: zod_1.z.array(zod_1.z.record(zod_1.z.any())),
    series: zod_1.z.array(ChartSeriesSchema).default([]),
}).nullable();
exports.assistantInputSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1),
    contextMode: zod_1.z.enum(['fiap', 'itau']),
    history: zod_1.z.array(MessageSchema).default([]),
});
exports.assistantOutputSchema = zod_1.z.object({
    markdown: zod_1.z.string(),
    chart: ChartSchema,
    imageRequest: zod_1.z.object({
        shouldGenerate: zod_1.z.boolean(),
        prompt: zod_1.z.string().default(''),
    }),
});
async function getCollectionCount(collectionName) {
    try {
        const snap = await firebase_admin_1.adminDb.collection(collectionName).get();
        return snap.size;
    }
    catch (error) {
        console.error(`Erro ao contar coleção ${collectionName}:`, error);
        return 0;
    }
}
async function getCollectionPreview(collectionName, limit = 5) {
    try {
        const snap = await firebase_admin_1.adminDb.collection(collectionName).limit(limit).get();
        return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    catch (error) {
        console.error(`Erro ao ler coleção ${collectionName}:`, error);
        return [];
    }
}
async function getDisciplinasComAulas(limitDisciplinas = 4, limitAulas = 4) {
    try {
        const disciplinasSnap = await firebase_admin_1.adminDb.collection('disciplinas').limit(limitDisciplinas).get();
        const result = await Promise.all(disciplinasSnap.docs.map(async (disciplinaDoc) => {
            const aulasSnap = await disciplinaDoc.ref.collection('aulas').limit(limitAulas).get();
            return {
                id: disciplinaDoc.id,
                ...disciplinaDoc.data(),
                aulas: aulasSnap.docs.map((aulaDoc) => ({
                    id: aulaDoc.id,
                    ...aulaDoc.data(),
                })),
            };
        }));
        return result;
    }
    catch (error) {
        console.error('Erro ao ler disciplinas/aulas:', error);
        return [];
    }
}
function summarizeObject(obj, maxLen = 220) {
    const text = JSON.stringify(obj);
    return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}
exports.assistantFlow = genkit_1.ai.defineFlow({
    name: 'assistantFlow',
    inputSchema: exports.assistantInputSchema,
    outputSchema: exports.assistantOutputSchema,
}, async ({ prompt, contextMode, history }) => {
    const [totalAlunos, totalAnalistas, totalFeedbacks, totalReunioes, totalTarefas, totalMateriais, totalNotificacoes, alunos, analistas, feedbacks, reunioes, tarefas, materiais, notificacoes, disciplinasComAulas,] = await Promise.all([
        getCollectionCount('alunos'),
        getCollectionCount('analistas'),
        getCollectionCount('feedbacks'),
        getCollectionCount('reunioes'),
        getCollectionCount('tarefas'),
        getCollectionCount('materiais'),
        getCollectionCount('notificacoes'),
        getCollectionPreview('alunos'),
        getCollectionPreview('analistas'),
        getCollectionPreview('feedbacks'),
        getCollectionPreview('reunioes'),
        getCollectionPreview('tarefas'),
        getCollectionPreview('materiais'),
        getCollectionPreview('notificacoes'),
        getDisciplinasComAulas(),
    ]);
    const historyText = history
        .slice(-12)
        .map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.text}`)
        .join('\n');
    const fiapScope = `
Você é o AI Assistant do ambiente FIAP do sistema TaskOS.

Você só pode responder sobre:
- alunos
- aulas
- disciplinas
- cronograma
- materiais
- atividades
- avaliações acadêmicas
- planejamento de aula
- gestão pedagógica
- organização acadêmica dentro da plataforma

Se o usuário pedir algo fora desse escopo, responda educadamente que você só atua no ambiente FIAP do sistema.
`;
    const itauScope = `
Você é o AI Assistant do ambiente Itaú do sistema TaskOS.

Você só pode responder sobre:
- analistas
- feedbacks
- reuniões
- avaliações de desempenho
- planos de ação
- acompanhamento profissional
- tarefas
- gestão do time
- organização do trabalho dentro da plataforma

Se o usuário pedir algo fora desse escopo, responda educadamente que você só atua no ambiente Itaú do sistema.
`;
    const contextBlock = `
Contexto disponível do banco Firebase.

IMPORTANTE:
- Os campos "TOTAL_*" abaixo representam a contagem REAL do banco.
- Os blocos "AMOSTRA_*" são apenas exemplos parciais para contexto qualitativo.
- Quando o usuário perguntar "quantos", "quantidade", "total", "número de registros", use SEMPRE os totais reais.
- Nunca responda "com base na amostra" se houver um total real disponível.
- Nunca confunda amostra com total.

TOTAIS REAIS:
- TOTAL_ALUNOS: ${totalAlunos}
- TOTAL_ANALISTAS: ${totalAnalistas}
- TOTAL_FEEDBACKS: ${totalFeedbacks}
- TOTAL_REUNIOES: ${totalReunioes}
- TOTAL_TAREFAS: ${totalTarefas}
- TOTAL_MATERIAIS: ${totalMateriais}
- TOTAL_NOTIFICACOES: ${totalNotificacoes}

AMOSTRA_ALUNOS:
${alunos.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}

AMOSTRA_ANALISTAS:
${analistas.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}

AMOSTRA_DISCIPLINAS_E_AULAS:
${disciplinasComAulas.map((item) => `- ${summarizeObject(item, 320)}`).join('\n') || '- sem dados'}

AMOSTRA_MATERIAIS:
${materiais.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}

AMOSTRA_FEEDBACKS:
${feedbacks.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}

AMOSTRA_REUNIOES:
${reunioes.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}

AMOSTRA_TAREFAS:
${tarefas.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}

AMOSTRA_NOTIFICACOES:
${notificacoes.map((item) => `- ${summarizeObject(item)}`).join('\n') || '- sem dados'}
`;
    const response = await genkit_1.ai.generate({
        prompt: `
${contextMode === 'fiap' ? fiapScope : itauScope}

${contextBlock}

Regras de resposta:
- Responda em português do Brasil.
- Use markdown bonito e bem organizado.
- Use títulos, subtítulos, bullets e tabelas curtas quando útil.
- Só use gráfico quando fizer sentido.
- Só gere imagem se o usuário pedir explicitamente algo visual.
- Sempre priorize os dados reais fornecidos no contexto.
- Se houver totais reais, use esses valores em respostas numéricas.
- Se não houver dado suficiente, diga isso claramente.
- Não invente campos que não estejam no contexto.
- Nunca diga "com base na amostra" ao responder contagens reais.

Histórico:
${historyText || 'Sem histórico.'}

Pergunta atual:
${prompt}

Retorne APENAS um JSON válido com esta estrutura:
{
  "markdown": "resposta em markdown",
  "chart": null ou {
    "type": "bar" | "line" | "pie",
    "title": "título",
    "description": "descrição opcional",
    "xKey": "campoX",
    "data": [{...}],
    "series": [{"key":"campoY","label":"Rótulo"}]
  },
  "imageRequest": {
    "shouldGenerate": true ou false,
    "prompt": "prompt detalhado para gerar imagem"
  }
}
`,
        output: {
            schema: exports.assistantOutputSchema,
        },
    });
    return response.output;
});
//# sourceMappingURL=assistant-flow.js.map