import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Send, User, Bot, Plus, Check, Copy } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { cn } from '../../lib/cn';
import { useTheme } from '../../lib/theme-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionable?: {
    type: 'aluno' | 'analista' | 'aula' | 'reuniao' | 'tarefa-fiap' | 'tarefa-itau' | 'avaliacao-aluno' | 'avaliacao-analista';
    data: any;
  };
}

interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  context: 'fiap' | 'itau' | 'both';
}

const quickPrompts: QuickPrompt[] = [
  {
    id: 'plano-aula',
    label: '📚 Plano de Aula',
    prompt: 'Crie um plano de aula completo sobre Machine Learning para alunos de Ciência de Dados, incluindo objetivos, conteúdo programático, atividades práticas e avaliação.',
    context: 'fiap',
  },
  {
    id: 'avaliacao-aluno',
    label: '📝 Avaliação de Aluno',
    prompt: 'Gere uma avaliação completa para um aluno de Python com nota 8.5, incluindo tipo de avaliação, data e comentários sobre desempenho.',
    context: 'fiap',
  },
  {
    id: 'nova-aula',
    label: '🎓 Nova Aula',
    prompt: 'Crie uma nova aula sobre Deep Learning com TensorFlow, com duração de 2 horas, incluindo título, descrição e material necessário.',
    context: 'fiap',
  },
  {
    id: 'avaliacao-analista',
    label: '⭐ Avaliação de Analista',
    prompt: 'Gere uma avaliação trimestral para um analista de dados com nota 9.0, incluindo comentários sobre competências técnicas, liderança e produtividade.',
    context: 'itau',
  },
  {
    id: 'nova-reuniao',
    label: '👥 Nova Reunião',
    prompt: 'Crie uma reunião de planejamento de sprint para o squad de IA, incluindo data, participantes, agenda e objetivos.',
    context: 'itau',
  },
  {
    id: 'feedback-time',
    label: '💼 Feedback de Time',
    prompt: 'Gere um feedback estruturado para o time de engenharia com recomendações de melhoria e pontos fortes identificados.',
    context: 'itau',
  },
];

// Simulação de respostas da IA com dados estruturados
const generateAIResponse = (userMessage: string): Message => {
  const lowerMessage = userMessage.toLowerCase();

  // Detectar tipo de solicitação e gerar resposta apropriada
  if (lowerMessage.includes('plano de aula') || lowerMessage.includes('aula sobre')) {
    const tema = extractTema(userMessage);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `# Plano de Aula: ${tema}\n\n**Série/Turma:** 3º Semestre - Ciência de Dados\n**Duração:** 2 horas\n**Objetivo:** Compreender os conceitos fundamentais e aplicar na prática\n\n## 1. Introdução (15 min)\n- Contextualização do tema com exemplos do mundo real\n- Discussão sobre conhecimentos prévios dos alunos\n- Apresentação dos objetivos da aula\n\n## 2. Desenvolvimento (90 min)\n\n### Conceitos Teóricos (30 min)\n- Explicação dos fundamentos\n- Demonstração de casos de uso\n- Exemplos práticos\n\n### Atividade Prática (60 min)\n- Hands-on com ferramentas\n- Exercícios em grupo\n- Desenvolvimento de mini-projeto\n\n## 3. Conclusão (15 min)\n- Recapitulação dos pontos principais\n- Q&A e discussão\n- Próximos passos e material complementar\n\n## Recursos Necessários\n- Computador com IDE instalado\n- Acesso à internet\n- Dataset para exercícios\n- Material de apoio digital\n\n## Avaliação\n- Participação: 30%\n- Exercício prático: 40%\n- Projeto final: 30%\n\n✅ **Conteúdo pronto para ser adicionado!**`,
      timestamp: new Date(),
      actionable: {
        type: 'aula',
        data: {
          titulo: `${tema}`,
          descricao: 'Aula completa gerada por IA',
          duracao: '2 horas',
          tipo: 'Teórica + Prática',
          materiais: 'Computador, IDE, Dataset',
        }
      }
    };
  }

  if (lowerMessage.includes('avaliação') && (lowerMessage.includes('aluno') || lowerMessage.includes('estudante'))) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `# Avaliação de Aluno Gerada\n\n**Tipo:** Projeto Final\n**Disciplina:** Machine Learning Avançado\n**Nota:** 8.5/10\n**Data:** ${new Date().toLocaleDateString('pt-BR')}\n\n## Comentários e Feedback\n\n### Pontos Fortes\n- Demonstrou excelente compreensão dos conceitos teóricos\n- Implementação técnica bem estruturada e documentada\n- Boa capacidade de análise e interpretação de resultados\n- Código limpo seguindo boas práticas\n\n### Áreas de Melhoria\n- Pode explorar técnicas mais avançadas de otimização\n- Documentação pode ser mais detalhada em alguns pontos\n- Apresentação oral pode ser mais confiante\n\n### Recomendações\n- Estudar algoritmos de ensemble learning\n- Praticar apresentações técnicas\n- Explorar frameworks mais modernos\n\n**Desempenho Geral:** Muito Bom\n**Status:** Aprovado\n\n✅ **Avaliação pronta para ser registrada!**`,
      timestamp: new Date(),
      actionable: {
        type: 'avaliacao-aluno',
        data: {
          disciplina: 'Machine Learning Avançado',
          tipo: 'Projeto Final',
          nota: '8.5',
          data: new Date().toISOString().split('T')[0],
          comentario: 'Demonstrou excelente compreensão dos conceitos teóricos. Implementação técnica bem estruturada. Pode explorar técnicas mais avançadas de otimização.',
        }
      }
    };
  }

  if (lowerMessage.includes('avaliação') && (lowerMessage.includes('analista') || lowerMessage.includes('funcionário') || lowerMessage.includes('colaborador'))) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `# Avaliação de Desempenho - Analista\n\n**Tipo:** Avaliação Trimestral\n**Nota Geral:** 9.0/10\n**Data:** ${new Date().toLocaleDateString('pt-BR')}\n**Período:** Q1 2026\n\n## Competências Avaliadas\n\n### Competência Técnica: 9.5/10\n- Domínio avançado das tecnologias do stack\n- Capacidade de resolver problemas complexos\n- Atualização constante com novas ferramentas\n\n### Liderança: 8.5/10\n- Mentoria efetiva de membros júnior\n- Tomada de decisão assertiva\n- Pode desenvolver mais visão estratégica\n\n### Comunicação: 8.8/10\n- Comunicação clara com o time\n- Boa documentação técnica\n- Apresentações bem estruturadas\n\n### Trabalho em Equipe: 9.2/10\n- Colaboração exemplar\n- Compartilhamento de conhecimento\n- Resolução construtiva de conflitos\n\n### Produtividade: 9.0/10\n- Entregas consistentes e no prazo\n- Alta qualidade do código\n- Gestão eficiente de tempo\n\n### Inovação: 8.5/10\n- Propõe melhorias nos processos\n- Busca soluções criativas\n- Pode ser mais proativo em inovação\n\n## Feedback Geral\n\nPerformance excepcional no trimestre. Demonstra crescimento contínuo e comprometimento com excelência. Recomendado para projetos de maior complexidade e possível promoção no próximo ciclo.\n\n## Próximos Passos\n1. Liderar projeto cross-funcional\n2. Certificação em cloud computing\n3. Apresentação técnica para outros squads\n\n✅ **Avaliação pronta para ser registrada!**`,
      timestamp: new Date(),
      actionable: {
        type: 'avaliacao-analista',
        data: {
          tipo: 'trimestral',
          nota: '9.0',
          data: new Date().toISOString().split('T')[0],
          comentario: 'Performance excepcional no trimestre. Demonstra crescimento contínuo e comprometimento com excelência. Domínio técnico avançado, liderança efetiva e excelente trabalho em equipe. Recomendado para projetos de maior complexidade.',
        }
      }
    };
  }

  if (lowerMessage.includes('novo aluno') || lowerMessage.includes('cadastrar aluno') || lowerMessage.includes('adicionar aluno')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `# Novo Aluno - Dados Gerados\n\n**Nome:** João Pedro Silva Santos\n**Email:** joao.santos@fiap.com.br\n**Curso:** Ciência de Dados e Inteligência Artificial\n**Matrícula:** RM98765\n**Telefone:** (11) 98765-4321\n\n## Informações Adicionais\n\n**Observações:**\nAluno com forte interesse em Machine Learning e Deep Learning. Participou de hackathons e possui projetos no GitHub. Demonstra proatividade e busca constantemente desafios técnicos.\n\n✅ **Dados prontos para cadastro!**`,
      timestamp: new Date(),
      actionable: {
        type: 'aluno',
        data: {
          nome: 'João Pedro Silva Santos',
          email: 'joao.santos@fiap.com.br',
          curso: 'Ciência de Dados e Inteligência Artificial',
          telefone: '(11) 98765-4321',
          matricula: 'RM98765',
          observacoes: 'Aluno com forte interesse em Machine Learning e Deep Learning. Participou de hackathons e possui projetos no GitHub.',
        }
      }
    };
  }

  if (lowerMessage.includes('novo analista') || lowerMessage.includes('cadastrar analista') || lowerMessage.includes('adicionar analista')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `# Novo Analista - Dados Gerados\n\n**Nome:** Maria Fernanda Costa Lima\n**Email:** maria.lima@itau.com.br\n**Função:** Analista de Dados Sênior\n**Telefone:** (11) 91234-5678\n**Salário:** R$ 12.000,00\n**Data de Admissão:** ${new Date().toISOString().split('T')[0]}\n\n## Informações Adicionais\n\n**Observações:**\nProfissional com 5 anos de experiência em análise de dados e business intelligence. Especialista em SQL, Python e ferramentas de visualização. Liderou projetos de migração de dados e implementação de dashboards executivos.\n\n✅ **Dados prontos para cadastro!**`,
      timestamp: new Date(),
      actionable: {
        type: 'analista',
        data: {
          nome: 'Maria Fernanda Costa Lima',
          email: 'maria.lima@itau.com.br',
          funcao: 'Analista de Dados Sênior',
          telefone: '(11) 91234-5678',
          salario: '12000',
          dataAdmissao: new Date().toISOString().split('T')[0],
          observacoes: 'Profissional com 5 anos de experiência em análise de dados e business intelligence. Especialista em SQL, Python e ferramentas de visualização.',
        }
      }
    };
  }

  if (lowerMessage.includes('reunião') || lowerMessage.includes('meeting')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `# Nova Reunião - Sprint Planning\n\n**Título:** Sprint Planning - Q2 2026\n**Data:** ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}\n**Horário:** 14:00 - 16:00\n**Local:** Sala de Reuniões A3 / Teams\n\n## Participantes\n- Product Owner\n- Scrum Master\n- Tech Lead\n- Squad completo (8 pessoas)\n\n## Agenda\n\n1. **Review do Sprint Anterior** (20 min)\n   - Retrospectiva de entregas\n   - Métricas e KPIs\n   - Lições aprendidas\n\n2. **Planejamento do Novo Sprint** (60 min)\n   - Apresentação de novas histórias\n   - Estimativa de esforço\n   - Definição de prioridades\n   - Distribuição de tarefas\n\n3. **Alinhamentos Técnicos** (30 min)\n   - Discussão de arquitetura\n   - Dependências entre times\n   - Riscos e impedimentos\n\n4. **Próximos Passos** (10 min)\n   - Definição de action items\n   - Agendamento de daily standups\n\n## Objetivos\n- Definir escopo do sprint\n- Alinhar expectativas com stakeholders\n- Identificar e mitigar riscos antecipadamente\n\n✅ **Reunião pronta para ser agendada!**`,
      timestamp: new Date(),
      actionable: {
        type: 'reuniao',
        data: {
          titulo: 'Sprint Planning - Q2 2026',
          data: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          horario: '14:00',
          duracao: '2 horas',
          participantes: 'Product Owner, Scrum Master, Tech Lead, Squad completo',
          descricao: 'Planejamento do novo sprint com definição de escopo, estimativas e alinhamentos técnicos.',
        }
      }
    };
  }

  // Resposta genérica inteligente
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: `Entendi sua solicitação! Posso ajudá-lo com diversas tarefas:\n\n**🎓 Para FIAP:**\n- Criar planos de aula detalhados\n- Gerar avaliações de alunos\n- Cadastrar novos alunos\n- Criar aulas e cronogramas\n- Adicionar tarefas no Kanban\n\n**💼 Para Itaú:**\n- Criar avaliações de analistas\n- Cadastrar novos analistas  \n- Agendar reuniões\n- Gerar feedbacks estruturados\n- Adicionar tarefas no Kanban\n\n**Como usar:**\nDescreva o que você precisa de forma natural. Por exemplo:\n- "Crie uma avaliação para um aluno de Python"\n- "Gere um plano de aula sobre Machine Learning"\n- "Preciso avaliar um analista sênior"\n- "Cadastre um novo aluno de Ciência de Dados"\n\nTente ser mais específico sobre o que você precisa e eu gerarei o conteúdo completo para você! 🚀`,
    timestamp: new Date(),
  };
};

// Função auxiliar para extrair tema da mensagem
const extractTema = (message: string): string => {
  const sobre = message.match(/sobre\s+([^,.!?]+)/i);
  if (sobre) return sobre[1].trim();
  
  const plano = message.match(/plano de aula[:\s]+([^,.!?]+)/i);
  if (plano) return plano[1].trim();
  
  return 'Tema da Aula';
};

export function AIAssistant() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou seu assistente de IA do DualOS. Posso ajudá-lo a criar conteúdos, avaliações, planos de aula, cadastros e muito mais!\n\nDescreva o que você precisa de forma natural e eu gerarei o conteúdo completo para você. Você também pode usar os prompts rápidos abaixo! 🚀',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  const handleAddToPage = (message: Message) => {
    if (!message.actionable) return;

    const { type, data } = message.actionable;

    // Redirecionar para a página apropriada com os dados
    switch (type) {
      case 'aluno':
        // Navegar para criar aluno com dados pré-preenchidos
        navigate('/fiap/alunos/novo', { state: data });
        break;
      case 'analista':
        navigate('/itau/analistas/novo', { state: data });
        break;
      case 'aula':
        navigate('/fiap/aulas/nova', { state: data });
        break;
      case 'reuniao':
        navigate('/itau/reunioes/nova', { state: data });
        break;
      case 'avaliacao-aluno':
        // Para avaliação, precisamos do ID do aluno
        // Por enquanto, vamos para a lista de alunos
        navigate('/fiap/alunos', { state: { avaliacaoData: data } });
        break;
      case 'avaliacao-analista':
        navigate('/itau/analistas', { state: { avaliacaoData: data } });
        break;
      case 'tarefa-fiap':
        navigate('/fiap/kanban/nova', { state: data });
        break;
      case 'tarefa-itau':
        navigate('/itau/kanban/nova', { state: data });
        break;
    }
  };

  const copyToClipboard = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const filteredPrompts = quickPrompts.filter(p => 
    p.context === 'both' || p.context === theme
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--theme-foreground)] flex items-center gap-3">
          <Sparkles className={cn(
            "w-7 h-7",
            theme === 'fiap' ? 'text-[#6A0DAD]' : 'text-[#EC7000]'
          )} />
          IA Assistant
        </h1>
        <p className="text-sm text-[var(--theme-muted-foreground)] mt-1">
          Seu copiloto inteligente para criação de conteúdo e automação
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filteredPrompts.map(prompt => (
          <Button
            key={prompt.id}
            variant="outline"
            size="sm"
            onClick={() => handleQuickPrompt(prompt.prompt)}
            className="text-xs"
          >
            {prompt.label}
          </Button>
        ))}
      </div>

      {/* Messages Container */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  theme === 'fiap' ? 'bg-[#6A0DAD]' : 'bg-[#EC7000]'
                )}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === 'user' 
                  ? 'bg-[var(--theme-accent)] text-white' 
                  : 'bg-[var(--theme-background-secondary)] text-[var(--theme-foreground)]'
              )}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={cn(
                  "text-[10px] mt-2",
                  message.role === 'user' ? 'text-white/70' : 'text-[var(--theme-muted-foreground)]'
                )}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* Action Buttons */}
                {message.role === 'assistant' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="h-7 text-xs gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedMessageId === message.id ? 'Copiado!' : 'Copiar'}
                    </Button>
                    {message.actionable && (
                      <Button
                        variant="theme"
                        size="sm"
                        onClick={() => handleAddToPage(message)}
                        className="h-7 text-xs gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Adicionar na Página
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[var(--theme-muted)] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[var(--theme-foreground)]" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                theme === 'fiap' ? 'bg-[#6A0DAD]' : 'bg-[#EC7000]'
              )}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-[var(--theme-background-secondary)] rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-[var(--theme-border)] p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Descreva o que você precisa... (Shift + Enter para nova linha)"
              className="min-h-[60px] max-h-[120px] resize-none text-sm"
            />
            <Button
              variant="theme"
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-[10px] text-[var(--theme-muted-foreground)] mt-2">
            Pressione Enter para enviar • Shift + Enter para nova linha
          </p>
        </div>
      </Card>
    </div>
  );
}