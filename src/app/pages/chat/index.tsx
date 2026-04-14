/**
 * Chat Guiado — jornadas conversacionais mobile-first para cadastro rápido no Firebase
 *
 * Fluxo: escolha da ação → escolha do workspace → coleta campo a campo
 *        → confirmação → persistência → sucesso / reinício
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, CheckCircle2, RotateCcw, Loader2,
  CheckSquare, Wallet, MessageSquare, Plane, SkipForward,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toast } from 'sonner';
import {
  saveChatData,
  type ChatAction,
  type ChatWorkspace,
} from '../../../services/chat-save-service';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type ChatStep = 'choose_action' | 'choose_workspace' | 'collect' | 'confirm' | 'saving' | 'success';

interface FieldOption { value: string; label: string; }

interface FieldDef {
  key:         string;
  question:    string;
  hint?:       string;
  type:        'text' | 'number' | 'date' | 'select' | 'textarea';
  required:    boolean;
  options?:    FieldOption[];
  placeholder?: string;
}

interface Message {
  id:        string;
  role:      'bot' | 'user';
  content:   string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOW DEFINITIONS — campos por ação
// ═══════════════════════════════════════════════════════════════════════════════

const FIELDS_TAREFA: FieldDef[] = [
  {
    key: 'titulo', question: '📝 Qual é o título da tarefa?',
    type: 'text', required: true,
    placeholder: 'Ex: Preparar relatório mensal',
  },
  {
    key: 'descricao', question: '📄 Descreva brevemente a tarefa:',
    hint: 'Opcional — pressione Pular para continuar',
    type: 'textarea', required: false,
    placeholder: 'Ex: Consolidar dados do trimestre...',
  },
  {
    key: 'prazo', question: '📅 Qual é o prazo?',
    hint: 'Opcional — pressione Pular para continuar',
    type: 'date', required: false,
  },
  {
    key: 'prioridade', question: '🎯 Qual é a prioridade?',
    type: 'select', required: true,
    options: [
      { value: 'low',    label: '🟢 Baixa'  },
      { value: 'medium', label: '🟡 Média'  },
      { value: 'high',   label: '🔴 Alta'   },
    ],
  },
];

const FIELDS_GASTO: FieldDef[] = [
  {
    key: 'descricao', question: '💸 O que foi esse gasto?',
    type: 'text', required: true,
    placeholder: 'Ex: Almoço com cliente',
  },
  {
    key: 'valor', question: '💰 Qual foi o valor em R$?',
    type: 'number', required: true,
    placeholder: 'Ex: 45.90',
  },
  {
    key: 'categoria', question: '🏷️ Qual a categoria?',
    type: 'select', required: true,
    options: [
      { value: 'alimentacao', label: '🍽️ Alimentação'  },
      { value: 'transporte',  label: '🚗 Transporte'   },
      { value: 'lazer',       label: '🎯 Lazer'        },
      { value: 'saude',       label: '💊 Saúde'        },
      { value: 'moradia',     label: '🏠 Moradia'      },
      { value: 'educacao',    label: '📚 Educação'     },
      { value: 'vestuario',   label: '👔 Vestuário'    },
      { value: 'outros',      label: '📦 Outros'       },
    ],
  },
  {
    key: 'data', question: '📅 Qual foi a data do gasto?',
    hint: 'Opcional — deixe em branco para usar hoje',
    type: 'date', required: false,
  },
  {
    key: 'notas', question: '📝 Alguma observação?',
    hint: 'Opcional — pressione Pular para continuar',
    type: 'textarea', required: false,
    placeholder: 'Ex: Reunião com fornecedor X',
  },
];

const FIELDS_FEEDBACK: FieldDef[] = [
  {
    key: 'pessoa', question: '👤 Sobre quem é este feedback?',
    type: 'text', required: true,
    placeholder: 'Ex: João Silva',
  },
  {
    key: 'tipo', question: '🏷️ Qual o tipo de feedback?',
    type: 'select', required: true,
    options: [
      { value: 'positivo',       label: '✅ Positivo'       },
      { value: 'construtivo',    label: '🔧 Construtivo'    },
      { value: 'tecnico',        label: '💻 Técnico'        },
      { value: 'comportamental', label: '🤝 Comportamental' },
      { value: 'lideranca',      label: '🌟 Liderança'      },
    ],
  },
  {
    key: 'contexto', question: '🎯 Em qual contexto aconteceu?',
    hint: 'Opcional — ex: Sprint review, apresentação...',
    type: 'text', required: false,
    placeholder: 'Ex: Apresentação de resultados Q1',
  },
  {
    key: 'descricao', question: '✍️ Descreva o feedback detalhadamente:',
    type: 'textarea', required: true,
    placeholder: 'Ex: Demonstrou excelente domínio técnico ao...',
  },
];

const FIELDS_VIAGEM: FieldDef[] = [
  {
    key: 'destino', question: '✈️ Para onde vai?',
    type: 'text', required: true,
    placeholder: 'Ex: Lisboa, Portugal',
  },
  {
    key: 'dataIda', question: '📅 Qual a data de ida?',
    type: 'date', required: true,
  },
  {
    key: 'dataVolta', question: '📅 Qual a data de volta?',
    hint: 'Opcional — pressione Pular para continuar',
    type: 'date', required: false,
  },
  {
    key: 'objetivo', question: '🎯 Qual o objetivo da viagem?',
    hint: 'Opcional — pressione Pular para continuar',
    type: 'textarea', required: false,
    placeholder: 'Ex: Conferência de tecnologia, férias com família...',
  },
];

const ACTION_FIELDS: Record<ChatAction, FieldDef[]> = {
  tarefa:   FIELDS_TAREFA,
  gasto:    FIELDS_GASTO,
  feedback: FIELDS_FEEDBACK,
  viagem:   FIELDS_VIAGEM,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIONS & WORKSPACES CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const ACTIONS = [
  { value: 'tarefa'   as ChatAction, label: 'Tarefa',     emoji: '✅', Icon: CheckSquare,  desc: 'Adicionar ao kanban'       },
  { value: 'gasto'    as ChatAction, label: 'Gasto',      emoji: '💸', Icon: Wallet,       desc: 'Registrar despesa'         },
  { value: 'feedback' as ChatAction, label: 'Feedback',   emoji: '💬', Icon: MessageSquare,desc: 'Dar feedback a alguém'     },
  { value: 'viagem'   as ChatAction, label: 'Viagem',     emoji: '✈️', Icon: Plane,        desc: 'Planejar uma viagem'       },
];

const WORKSPACES = [
  { value: 'fiap'    as ChatWorkspace, label: 'FIAP',    emoji: '🎓', color: '#C62828', bg: 'rgba(198,40,40,0.1)'   },
  { value: 'itau'    as ChatWorkspace, label: 'Itaú',    emoji: '🏦', color: '#F57C00', bg: 'rgba(245,124,0,0.1)'   },
  { value: 'pessoal' as ChatWorkspace, label: 'Pessoal', emoji: '👤', color: '#059669', bg: 'rgba(5,150,105,0.1)'   },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function mkMsg(role: 'bot' | 'user', content: string): Message {
  return { id: crypto.randomUUID(), role, content, timestamp: new Date() };
}

function getActionLabel(a: ChatAction) {
  return ACTIONS.find(x => x.value === a)?.label ?? a;
}

function getWorkspaceLabel(w: ChatWorkspace) {
  return WORKSPACES.find(x => x.value === w)?.label ?? w;
}

function getOptionLabel(field: FieldDef, value: string) {
  return field.options?.find(o => o.value === value)?.label ?? value;
}

function formatFieldValue(field: FieldDef, value: string): string {
  if (!value) return '—';
  if (field.type === 'select') return getOptionLabel(field, value);
  if (field.type === 'date') {
    try {
      return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return value; }
  }
  if (field.type === 'number') return `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  return value;
}

function getFieldLabel(field: FieldDef): string {
  // Extrai label do campo da pergunta (remove emoji e ":")
  return field.question.replace(/^[^\w]+/, '').replace(/\?.*$/, '').replace(/:.*$/, '').trim();
}

function validateField(field: FieldDef, value: string): string | null {
  if (field.required && !value.trim()) return '⚠️ Este campo é obrigatório. Por favor, informe um valor.';
  if (field.type === 'number' && value.trim()) {
    const n = parseFloat(value.replace(',', '.'));
    if (isNaN(n) || n <= 0) return '⚠️ Digite um valor numérico maior que zero.';
  }
  if (field.type === 'date' && value.trim()) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '⚠️ Data inválida. Use o seletor de data.';
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={cn('flex gap-2 items-end', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
          style={{ background: 'var(--theme-accent)' }}
        >
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
          isBot
            ? 'rounded-bl-sm'
            : 'rounded-br-sm text-white',
        )}
        style={isBot
          ? { background: 'var(--theme-card)', color: 'var(--theme-foreground)', border: '1px solid var(--theme-border)' }
          : { background: 'var(--theme-accent)' }
        }
      >
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  if (total === 0) return null;
  const pct = Math.round((current / total) * 100);
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-[var(--theme-muted)]">
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'var(--theme-accent)' }}
        />
      </div>
      <span className="text-xs text-[var(--theme-muted-foreground)] flex-shrink-0">
        {current}/{total}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function ChatGuiado() {
  const [step,       setStep]       = useState<ChatStep>('choose_action');
  const [action,     setAction]     = useState<ChatAction | null>(null);
  const [workspace,  setWorkspace]  = useState<ChatWorkspace | null>(null);
  const [fields,     setFields]     = useState<FieldDef[]>([]);
  const [fieldIndex, setFieldIndex] = useState(0);
  const [answers,    setAnswers]    = useState<Record<string, string>>({});
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSaving,   setIsSaving]   = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // ── scroll to bottom ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }, []);

  // ── add messages ─────────────────────────────────────────────────────────────
  const addMsg = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
    scrollToBottom();
  }, [scrollToBottom]);

  const addBot  = useCallback((text: string) => addMsg(mkMsg('bot',  text)), [addMsg]);
  const addUser = useCallback((text: string) => addMsg(mkMsg('user', text)), [addMsg]);

  // ── initial greeting ─────────────────────────────────────────────────────────
  useEffect(() => {
    setMessages([
      mkMsg('bot', '👋 Olá! Sou o assistente de cadastro do TaskOS.\n\nO que você quer fazer hoje?'),
    ]);
  }, []);

  // ── focus input on collect step ──────────────────────────────────────────────
  useEffect(() => {
    if (step === 'collect') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step, fieldIndex]);

  // ── STEP 1: escolha da ação ──────────────────────────────────────────────────
  const handleActionSelect = useCallback((selectedAction: ChatAction) => {
    const cfg = ACTIONS.find(a => a.value === selectedAction)!;
    setAction(selectedAction);
    addUser(`${cfg.emoji} ${cfg.label}`);
    setTimeout(() => {
      addBot(`Ótimo! Vou cadastrar uma **${cfg.label.toLowerCase()}**.\n\nEm qual workspace?`);
      setStep('choose_workspace');
    }, 200);
  }, [addUser, addBot]);

  // ── STEP 2: escolha do workspace ─────────────────────────────────────────────
  const handleWorkspaceSelect = useCallback((selectedWs: ChatWorkspace) => {
    if (!action) return;
    const wsCfg = WORKSPACES.find(w => w.value === selectedWs)!;
    setWorkspace(selectedWs);
    const actionFields = ACTION_FIELDS[action];
    setFields(actionFields);
    setFieldIndex(0);
    setAnswers({});
    addUser(`${wsCfg.emoji} ${wsCfg.label}`);
    setTimeout(() => {
      const firstField = actionFields[0];
      addBot(buildQuestion(firstField, 1, actionFields.length));
      setStep('collect');
    }, 200);
  }, [action, addUser, addBot]);

  function buildQuestion(field: FieldDef, index: number, total: number): string {
    const progress = `(${index}/${total})`;
    const hint = field.hint ? `\n_${field.hint}_` : '';
    return `${progress} ${field.question}${hint}`;
  }

  // ── STEP 3: coleta de campos ──────────────────────────────────────────────────
  const submitFieldValue = useCallback((rawValue: string) => {
    const field = fields[fieldIndex];
    if (!field) return;

    const value = field.type === 'number'
      ? rawValue.replace(',', '.')
      : rawValue.trim();

    // Validação
    const error = validateField(field, value);
    if (error) {
      setErrorMsg(error);
      addBot(error);
      return;
    }
    setErrorMsg('');

    // Registra resposta
    const finalValue = value;
    addUser(value ? formatFieldValue(field, value) : '— Pulei');
    setAnswers(prev => ({ ...prev, [field.key]: finalValue }));
    setInputValue('');

    const nextIndex = fieldIndex + 1;
    if (nextIndex < fields.length) {
      setTimeout(() => {
        const nextField = fields[nextIndex];
        addBot(buildQuestion(nextField, nextIndex + 1, fields.length));
        setFieldIndex(nextIndex);
      }, 200);
    } else {
      // Todos os campos coletados → confirmação
      setTimeout(() => {
        addBot('✅ Perfeito! Confira os dados antes de salvar:');
        setFieldIndex(nextIndex);
        setStep('confirm');
      }, 200);
    }
  }, [fields, fieldIndex, addUser, addBot]);

  const handleSelectOption = useCallback((value: string) => {
    submitFieldValue(value);
  }, [submitFieldValue]);

  const handleInputSubmit = useCallback(() => {
    const field = fields[fieldIndex];
    if (!field) return;
    submitFieldValue(inputValue);
  }, [fields, fieldIndex, inputValue, submitFieldValue]);

  const handleSkip = useCallback(() => {
    submitFieldValue('');
  }, [submitFieldValue]);

  // ── STEP 4: confirmação ──────────────────────────────────────────────────────
  const handleConfirm = useCallback(async () => {
    if (!action || !workspace) return;
    setStep('saving');
    setIsSaving(true);
    try {
      const id = await saveChatData(action, workspace, answers);
      addBot(`🎉 ${getActionLabel(action)} salva com sucesso no workspace **${getWorkspaceLabel(workspace)}**!\n\nID: ${id.slice(0, 8)}...`);
      setStep('success');
    } catch (err: any) {
      const msg = err?.message ?? 'Erro desconhecido';
      addBot(`❌ Erro ao salvar: ${msg}\n\nVocê pode tentar novamente.`);
      toast.error('Erro ao salvar — tente novamente');
      setStep('confirm');
    } finally {
      setIsSaving(false);
    }
  }, [action, workspace, answers, addBot]);

  const handleEditAnswers = useCallback(() => {
    if (!action) return;
    const actionFields = ACTION_FIELDS[action];
    setFieldIndex(0);
    setFields(actionFields);
    addBot('Ok! Vamos revisar as respostas.\n\n' + buildQuestion(actionFields[0], 1, actionFields.length));
    setStep('collect');
  }, [action, addBot]);

  // ── STEP 6: reiniciar ────────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    setStep('choose_action');
    setAction(null);
    setWorkspace(null);
    setFields([]);
    setFieldIndex(0);
    setAnswers({});
    setInputValue('');
    setErrorMsg('');
    setMessages([
      mkMsg('bot', '✨ Pronto! Vamos começar uma nova jornada.\n\nO que você quer fazer agora?'),
    ]);
  }, []);

  // ── derived ──────────────────────────────────────────────────────────────────
  const currentField     = step === 'collect' ? fields[fieldIndex] : null;
  const isSelectField    = currentField?.type === 'select';
  const isOptionalField  = currentField && !currentField.required;
  const showTextInput    = step === 'collect' && !isSelectField;
  const showSkip         = showTextInput && isOptionalField;

  const collectProgress  = step === 'collect' || step === 'confirm' || step === 'saving' || step === 'success'
    ? { current: Math.min(fieldIndex, fields.length), total: fields.length }
    : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* ── Chat Header ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: 'var(--theme-card)', borderBottom: '1px solid var(--theme-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: 'var(--theme-accent)' }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--theme-foreground)]">Chat Guiado</p>
            {action && workspace && (
              <p className="text-xs text-[var(--theme-muted-foreground)]">
                {getActionLabel(action)} · {getWorkspaceLabel(workspace)}
              </p>
            )}
            {!action && (
              <p className="text-xs text-[var(--theme-muted-foreground)]">Cadastro rápido por conversa</p>
            )}
          </div>
        </div>
        {step !== 'choose_action' && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-[var(--theme-background-secondary)]"
            style={{ color: 'var(--theme-muted-foreground)' }}
            title="Reiniciar jornada"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        )}
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      {collectProgress && collectProgress.total > 0 && (
        <div className="flex-shrink-0" style={{ background: 'var(--theme-card)', borderBottom: '1px solid var(--theme-border)' }}>
          <ProgressBar current={collectProgress.current} total={collectProgress.total} />
        </div>
      )}

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {/* ── Action selector ─────────────────────────────────────────── */}
        {step === 'choose_action' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {ACTIONS.map(a => (
              <button
                key={a.value}
                onClick={() => handleActionSelect(a.value)}
                className="flex flex-col items-start gap-1.5 rounded-2xl p-4 text-left transition-all active:scale-95 hover:shadow-md"
                style={{
                  background: 'var(--theme-card)',
                  border: '1.5px solid var(--theme-border)',
                }}
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-sm font-semibold text-[var(--theme-foreground)]">{a.label}</span>
                <span className="text-xs text-[var(--theme-muted-foreground)]">{a.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Workspace selector ──────────────────────────────────────── */}
        {step === 'choose_workspace' && (
          <div className="flex flex-col gap-2 pt-1">
            {WORKSPACES.map(w => (
              <button
                key={w.value}
                onClick={() => handleWorkspaceSelect(w.value)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-95"
                style={{ background: w.bg, border: `1.5px solid ${w.color}40` }}
              >
                <span className="text-xl">{w.emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: w.color }}>{w.label}</p>
                </div>
                <div className="ml-auto">
                  <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: w.color }} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Select field options ─────────────────────────────────────── */}
        {step === 'collect' && isSelectField && currentField?.options && (
          <div className="flex flex-wrap gap-2 pt-1">
            {currentField.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 hover:shadow-md"
                style={{
                  background: 'var(--theme-card)',
                  border: '1.5px solid var(--theme-accent)',
                  color: 'var(--theme-accent)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Confirmation card ───────────────────────────────────────── */}
        {(step === 'confirm' || step === 'saving') && action && workspace && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-card)' }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'var(--theme-background-secondary)', borderBottom: '1px solid var(--theme-border)' }}
            >
              <div
                className="h-6 w-6 flex items-center justify-center rounded-full"
                style={{ background: 'var(--theme-accent)' }}
              >
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--theme-foreground)]">
                  {getActionLabel(action)} · {getWorkspaceLabel(workspace)}
                </p>
              </div>
            </div>

            {/* Fields summary */}
            <div className="px-4 py-3 space-y-2">
              {fields
                .filter(f => answers[f.key])
                .map(field => (
                  <div key={field.key} className="flex justify-between gap-3 text-sm">
                    <span className="text-[var(--theme-muted-foreground)] flex-shrink-0">{getFieldLabel(field)}</span>
                    <span className="font-medium text-[var(--theme-foreground)] text-right">{formatFieldValue(field, answers[field.key])}</span>
                  </div>
                ))
              }
            </div>

            {/* Actions */}
            <div
              className="px-4 py-3 flex gap-2"
              style={{ borderTop: '1px solid var(--theme-border)' }}
            >
              <button
                onClick={handleEditAnswers}
                disabled={isSaving}
                className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50"
                style={{ border: '1.5px solid var(--theme-border)', color: 'var(--theme-muted-foreground)' }}
              >
                ✏️ Corrigir
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSaving}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'var(--theme-accent)' }}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : '💾'}
                {isSaving ? 'Salvando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}

        {/* ── Success card ─────────────────────────────────────────────── */}
        {step === 'success' && (
          <div
            className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
            style={{ background: 'rgba(5,150,105,0.08)', border: '1.5px solid rgba(5,150,105,0.3)' }}
          >
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(5,150,105,0.15)' }}
            >
              <CheckCircle2 className="h-8 w-8" style={{ color: '#059669' }} />
            </div>
            <div>
              <p className="font-bold text-[var(--theme-foreground)] mb-1">Salvo com sucesso! 🎉</p>
              <p className="text-sm text-[var(--theme-muted-foreground)]">
                {action && getActionLabel(action)} registrada no workspace {workspace && getWorkspaceLabel(workspace)}.
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="w-full rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: 'var(--theme-accent)' }}
            >
              <RotateCcw className="h-4 w-4" /> Nova Jornada
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ───────────────────────────────────────────────────── */}
      {showTextInput && currentField && (
        <div
          className="flex-shrink-0 px-4 py-3 flex flex-col gap-2"
          style={{ background: 'var(--theme-card)', borderTop: '1px solid var(--theme-border)' }}
        >
          {/* Hint */}
          {currentField.hint && (
            <p className="text-xs text-[var(--theme-muted-foreground)] px-1">{currentField.hint}</p>
          )}

          <div className="flex items-end gap-2">
            {currentField.type === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={2}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleInputSubmit(); }
                }}
                placeholder={currentField.placeholder ?? 'Digite aqui…'}
                className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                style={{
                  background: 'var(--theme-background-secondary)',
                  border: '1.5px solid var(--theme-border)',
                  color: 'var(--theme-foreground)',
                }}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={currentField.type === 'number' ? 'number' : currentField.type === 'date' ? 'date' : 'text'}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleInputSubmit(); }}
                placeholder={currentField.placeholder ?? 'Digite aqui…'}
                step={currentField.type === 'number' ? '0.01' : undefined}
                min={currentField.type === 'number' ? '0' : undefined}
                className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
                style={{
                  background: 'var(--theme-background-secondary)',
                  border: '1.5px solid var(--theme-border)',
                  color: 'var(--theme-foreground)',
                }}
              />
            )}

            <button
              onClick={handleInputSubmit}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all active:scale-90"
              style={{ background: 'var(--theme-accent)' }}
              title="Enviar"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>

          {showSkip && (
            <button
              onClick={handleSkip}
              className="flex items-center justify-center gap-1 py-1 text-xs rounded-lg transition-colors"
              style={{ color: 'var(--theme-muted-foreground)' }}
            >
              <SkipForward className="h-3.5 w-3.5" /> Pular este campo
            </button>
          )}
        </div>
      )}

      {/* Saving overlay (no input) */}
      {step === 'saving' && (
        <div
          className="flex-shrink-0 px-4 py-4 flex items-center justify-center gap-2"
          style={{ borderTop: '1px solid var(--theme-border)', background: 'var(--theme-card)' }}
        >
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--theme-accent)' }} />
          <span className="text-sm text-[var(--theme-muted-foreground)]">Salvando no Firebase…</span>
        </div>
      )}
    </div>
  );
}
