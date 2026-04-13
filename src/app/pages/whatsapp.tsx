import { useState, useEffect } from 'react';
import {
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import * as whatsappService from '../../services/whatsapp-service';

const WEBHOOK_URL = `https://us-central1-taskos-a2080.cloudfunctions.net/whatsappWebhook`;

const CONTEXTO_COR: Record<string, string> = {
  'FIAP': '#6A0DAD',
  'Itaú': '#EC7000',
  'Pessoal': '#059669',
};

export function WhatsAppIntegracao() {
  const [mensagens, setMensagens] = useState<whatsappService.WhatsAppMensagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comandoAberto, setComandoAberto] = useState<string | null>(null);
  const [passoAtivo, setPassoAtivo] = useState(0);

  useEffect(() => {
    whatsappService.listarMensagens(30).then(setMensagens).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast.success('Copiado!');
  };

  const PASSOS_CONFIGURACAO = [
    {
      titulo: '1. Criar conta Meta Business',
      descricao: 'Acesse business.facebook.com e crie uma conta gratuita de negócios.',
      link: 'https://business.facebook.com',
      linkLabel: 'Abrir Meta Business',
    },
    {
      titulo: '2. Criar App no Meta for Developers',
      descricao: 'Vá em developers.facebook.com → Criar App → selecione "Business" e depois adicione o produto "WhatsApp".',
      link: 'https://developers.facebook.com',
      linkLabel: 'Abrir Developers',
    },
    {
      titulo: '3. Configurar número de teste',
      descricao: 'No painel do WhatsApp Business API, você receberá um número de teste gratuito. Adicione seu número pessoal como destinatário de teste.',
    },
    {
      titulo: '4. Configurar Webhook',
      descricao: 'Em Configurações → Webhooks, insira a URL abaixo e o token de verificação "taskos-webhook-2025".',
      code: WEBHOOK_URL,
    },
    {
      titulo: '5. Selecionar eventos',
      descricao: 'Assine os eventos: messages (para receber as mensagens enviadas para o número de teste).',
    },
    {
      titulo: '6. Deploy da Cloud Function',
      descricao: 'Execute o comando abaixo no terminal do projeto para publicar a função webhook.',
      code: 'cd functions && npm run deploy',
    },
    {
      titulo: '7. Testar',
      descricao: 'Envie uma mensagem para o número de teste usando um dos comandos abaixo. A mensagem aparecerá nesta tela em instantes.',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)] flex items-center gap-3">
            <MessageCircle className="h-8 w-8" style={{ color: '#25D366' }} />
            Integração WhatsApp
          </h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Envie tarefas, reuniões e gastos diretamente pelo WhatsApp — tudo salvo automaticamente no Firebase
          </p>
        </div>
        <Badge
          className="text-sm px-3 py-1"
          style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366' }}
        >
          API Gratuita
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Guia de Configuração */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: 'var(--theme-accent)' }} />
                Guia de Configuração — Meta WhatsApp Business Cloud API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PASSOS_CONFIGURACAO.map((passo, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--theme-border)' }}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    style={{
                      background: passoAtivo === i ? 'var(--theme-hover)' : 'var(--theme-card)',
                    }}
                    onClick={() => setPassoAtivo(passoAtivo === i ? -1 : i)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
                        style={{ background: 'var(--theme-accent)', color: '#fff' }}
                      >
                        {i + 1}
                      </div>
                      <span className="font-medium text-[var(--theme-foreground)]">{passo.titulo}</span>
                    </div>
                    {passoAtivo === i ? (
                      <ChevronUp className="h-4 w-4 text-[var(--theme-muted-foreground)]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[var(--theme-muted-foreground)]" />
                    )}
                  </button>

                  {passoAtivo === i && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-sm text-[var(--theme-muted-foreground)]">{passo.descricao}</p>
                      {passo.link && (
                        <a
                          href={passo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium"
                          style={{ color: 'var(--theme-accent)' }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {passo.linkLabel}
                        </a>
                      )}
                      {passo.code && (
                        <div
                          className="flex items-center justify-between rounded-lg px-4 py-3 font-mono text-sm"
                          style={{ background: 'var(--theme-background-secondary)' }}
                        >
                          <span className="break-all text-[var(--theme-foreground)]">{passo.code}</span>
                          <button
                            onClick={() => copiar(passo.code!)}
                            className="ml-3 flex-shrink-0 text-[var(--theme-muted-foreground)] hover:text-[var(--theme-accent)]"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comandos */}
          <Card>
            <CardHeader>
              <CardTitle>Comandos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {whatsappService.COMANDOS_WHATSAPP.map((cmd) => (
                <div
                  key={cmd.comando}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--theme-border)' }}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() =>
                      setComandoAberto(comandoAberto === cmd.comando ? null : cmd.comando)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <code
                        className="rounded-lg px-2 py-1 text-sm font-bold"
                        style={{ background: `${cmd.cor}20`, color: cmd.cor }}
                      >
                        {cmd.comando}
                      </code>
                      <span className="text-sm text-[var(--theme-foreground)]">{cmd.descricao}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="text-xs"
                        style={{
                          background: `${CONTEXTO_COR[cmd.contexto] || '#6B7280'}20`,
                          color: CONTEXTO_COR[cmd.contexto] || '#6B7280',
                        }}
                      >
                        {cmd.contexto}
                      </Badge>
                      {comandoAberto === cmd.comando ? (
                        <ChevronUp className="h-4 w-4 text-[var(--theme-muted-foreground)]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[var(--theme-muted-foreground)]" />
                      )}
                    </div>
                  </button>

                  {comandoAberto === cmd.comando && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-muted-foreground)] uppercase mb-1">
                          Campos (separados por |)
                        </p>
                        <ul className="space-y-1">
                          {cmd.campos.map((campo, i) => (
                            <li key={i} className="text-sm text-[var(--theme-foreground)] flex items-center gap-2">
                              <span
                                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                                style={{ background: cmd.cor }}
                              />
                              {campo}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-muted-foreground)] uppercase mb-1">
                          Exemplo
                        </p>
                        <div
                          className="flex items-center justify-between rounded-lg px-4 py-3 font-mono text-sm"
                          style={{ background: 'var(--theme-background-secondary)' }}
                        >
                          <span className="text-[var(--theme-foreground)]">{cmd.exemplo}</span>
                          <button
                            onClick={() => copiar(cmd.exemplo)}
                            className="ml-3 flex-shrink-0 text-[var(--theme-muted-foreground)] hover:text-[var(--theme-accent)]"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status da Integração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(37,211,102,0.08)' }}>
                <MessageCircle className="h-5 w-5" style={{ color: '#25D366' }} />
                <div>
                  <p className="text-sm font-medium text-[var(--theme-foreground)]">WhatsApp Business API</p>
                  <p className="text-xs text-[var(--theme-muted-foreground)]">Meta Cloud API — Gratuito</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-[var(--theme-foreground)]">Webhook configurado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-[var(--theme-foreground)]">Firebase integrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-[var(--theme-foreground)]">Aguardando deploy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URL do Webhook */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">URL do Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg p-3 font-mono text-xs break-all"
                style={{ background: 'var(--theme-background-secondary)' }}
              >
                {WEBHOOK_URL}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 gap-2"
                onClick={() => copiar(WEBHOOK_URL)}
              >
                <Copy className="h-4 w-4" /> Copiar URL
              </Button>
              <p className="text-xs text-[var(--theme-muted-foreground)] mt-2">
                Token de verificação: <code className="font-mono">taskos-webhook-2025</code>
              </p>
            </CardContent>
          </Card>

          {/* Mensagens Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mensagens Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="h-5 w-5 animate-spin text-[var(--theme-accent)]" />
                </div>
              ) : mensagens.length === 0 ? (
                <p className="text-xs text-center py-4 text-[var(--theme-muted-foreground)]">
                  Nenhuma mensagem recebida ainda.
                  <br />
                  Configure a integração e envie um comando pelo WhatsApp.
                </p>
              ) : (
                <div className="space-y-2">
                  {mensagens.slice(0, 5).map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-lg p-3"
                      style={{ background: 'var(--theme-background-secondary)' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-xs font-mono text-[var(--theme-muted-foreground)]">{msg.de}</code>
                        <div className="flex items-center gap-1">
                          {msg.processada ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          <span className="text-xs" style={{ color: msg.processada ? '#10B981' : '#F59E0B' }}>
                            {msg.processada ? 'OK' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--theme-foreground)] line-clamp-2">{msg.corpo}</p>
                      {msg.tipoComando && msg.tipoComando !== 'desconhecido' && (
                        <Badge className="text-xs mt-1" style={{ background: 'var(--theme-hover)', color: 'var(--theme-accent)' }}>
                          {msg.tipoComando}
                        </Badge>
                      )}
                      <p className="text-xs text-[var(--theme-muted-foreground)] mt-1">
                        {format(new Date(msg.recebidasEm), "d MMM, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
