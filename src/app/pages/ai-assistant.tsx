import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Send, User, Bot, Copy, Loader, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../../lib/cn';
import { toast } from 'sonner';
import * as openaiService from '../../lib/openai-service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    id: 'plano-aula',
    label: 'Plano de Aula',
    prompt: 'Crie um plano de aula completo sobre Machine Learning para alunos de Ciência de Dados.',
    icon: '📚',
  },
  {
    id: 'avaliacao-aluno',
    label: 'Avaliação de Aluno',
    prompt: 'Gere uma avaliação completa para um aluno com nota 8.5.',
    icon: '📝',
  },
  {
    id: 'nova-aula',
    label: 'Nova Aula',
    prompt: 'Crie uma nova aula sobre Deep Learning com TensorFlow, com duração de 2 horas.',
    icon: '🎓',
  },
  {
    id: 'feedback',
    label: 'Feedback de Time',
    prompt: 'Gere um feedback estruturado para o time com recomendações de melhoria.',
    icon: '💼',
  },
];

export function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await openaiService.askAIAssistant(
        text,
        'fiap',
        messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao processar sua mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copiado!');
    } catch {
      toast.error('Não foi possível copiar a mensagem');
    }
  };

  return (
    <div className="w-full h-full min-h-0 bg-[var(--theme-background)] flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="shrink-0 flex items-center gap-4 p-4 border-b border-[var(--theme-border)] bg-[var(--theme-background)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-6 h-6 text-[var(--theme-accent)] shrink-0" />
          <h1 className="text-xl font-bold text-[var(--theme-foreground)] truncate">
            IA Assistant
          </h1>
        </div>
      </div>

      {/* Corpo: ocupa restante da tela sem criar scroll externo */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Somente esta área deve rolar */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[var(--theme-background)]">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto w-full min-h-full flex flex-col justify-center">
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-[var(--theme-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--theme-foreground)] mb-2">
                  Bem-vindo ao IA Assistant
                </h2>
                <p className="text-[var(--theme-muted-foreground)]">
                  Utilize o poder da IA para criar planos de aula, gerar avaliações,
                  agendar reuniões e muito mais.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="p-4 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-background-secondary)] transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{prompt.icon}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--theme-foreground)]">
                          {prompt.label}
                        </p>
                        <p className="text-xs text-[var(--theme-muted-foreground)] mt-1 line-clamp-2">
                          {prompt.prompt}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-accent)] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] px-4 py-3 rounded-lg',
                      message.role === 'user'
                        ? 'bg-[var(--theme-accent)] text-white'
                        : 'bg-[var(--theme-background-secondary)] text-[var(--theme-foreground)]'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyMessage(message.content)}
                      className="flex-shrink-0 self-start"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-background-secondary)] flex items-center justify-center">
                      <User className="w-4 h-4 text-[var(--theme-foreground)]" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--theme-accent)] flex items-center justify-center">
                    <Loader className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="bg-[var(--theme-background-secondary)] px-4 py-2 rounded-lg">
                    <p className="text-sm text-[var(--theme-muted-foreground)]">
                      Processando...
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Rodapé fixo */}
        <div className="shrink-0 border-t border-[var(--theme-border)] p-4 bg-[var(--theme-background)]">
          <div className="max-w-2xl mx-auto w-full space-y-3">
            {messages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    disabled={isLoading}
                    className="flex-shrink-0 px-3 py-1 rounded-full bg-[var(--theme-background-secondary)] hover:bg-[var(--theme-accent)] hover:text-white transition-all text-xs font-medium disabled:opacity-50 whitespace-nowrap"
                  >
                    {prompt.icon} {prompt.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Digite sua pergunta ou solicitação..."
                className="flex-1 min-h-12 max-h-24 resize-none"
                disabled={isLoading}
              />

              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 gap-2 h-12"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <p className="text-xs text-[var(--theme-muted-foreground)] text-center">
              Pressione Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}