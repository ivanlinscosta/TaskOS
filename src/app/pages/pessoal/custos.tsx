import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus, Wallet, TrendingDown, TrendingUp, Trash2, Loader,
  ArrowUpCircle, ArrowDownCircle, BarChart3, Plane, X,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../../components/ui/dialog';
import { format, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import * as custosService from '../../../services/custos-service';
import * as receitasService from '../../../services/receitas-service';
import * as viagensService from '../../../services/viagens-service';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const ANO_ATUAL = new Date().getFullYear();

// ── Tooltip customizado ────────────────────────────────────────────────────────
const TooltipBRL = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 shadow-lg text-sm" style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}>
      <p className="font-semibold mb-2 text-[var(--theme-foreground)]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill || p.stroke }}>
          {p.name}: R$ {(p.value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function valorPorMes(
  items: { data: Date; valor: number }[],
  ano = ANO_ATUAL
): number[] {
  const arr = Array(12).fill(0);
  items.forEach(({ data, valor }) => {
    const d = new Date(data);
    if (getYear(d) === ano) arr[getMonth(d)] += valor;
  });
  return arr;
}

function viagemCustosPorMes(viagens: viagensService.Viagem[], ano = ANO_ATUAL): number[] {
  const arr = Array(12).fill(0);
  viagens.forEach((v) => {
    const itens = v.orcamentoDetalhado || [];
    if (itens.length === 0 && v.orcamento > 0) {
      // viagens sem detalhamento → soma no mês da ida
      const d = new Date(v.dataIda);
      if (getYear(d) === ano) arr[getMonth(d)] += v.orcamento;
      return;
    }
    itens.forEach((item) => {
      if (item.formaPagamento === 'a_prazo' && item.dataPrimeiraParcela && item.parcelas) {
        const valorParcela = item.valor / item.parcelas;
        for (let p = 0; p < item.parcelas; p++) {
          const d = new Date(item.dataPrimeiraParcela);
          d.setMonth(d.getMonth() + p);
          if (getYear(d) === ano) arr[getMonth(d)] += valorParcela;
        }
      } else {
        const d = new Date(v.dataIda);
        if (getYear(d) === ano) arr[getMonth(d)] += item.valor;
      }
    });
  });
  return arr;
}

export function Custos() {
  const navigate = useNavigate();

  const [custos,    setCustos]    = useState<custosService.Custo[]>([]);
  const [receitas,  setReceitas]  = useState<receitasService.Receita[]>([]);
  const [viagens,   setViagens]   = useState<viagensService.Viagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI
  const [aba,              setAba]              = useState<'visao'|'despesas'|'receitas'>('visao');
  const [dialogDespesa,    setDialogDespesa]    = useState(false);
  const [dialogReceita,    setDialogReceita]    = useState(false);
  const [formDespesa, setFormDespesa] = useState({
    descricao: '', valor: '', categoria: 'outros' as custosService.CategoriaCusto,
    tipo: 'variavel' as 'fixa'|'variavel', data: new Date().toISOString().split('T')[0], notas: '',
  });
  const [formReceita, setFormReceita] = useState({
    descricao: '', valor: '', categoria: 'salario' as receitasService.CategoriaReceita,
    data: new Date().toISOString().split('T')[0], recorrente: false, notas: '',
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [c, r, v] = await Promise.all([
          custosService.listarCustos(),
          receitasService.listarReceitas(),
          viagensService.listarViagens(),
        ]);
        setCustos(c); setReceitas(r); setViagens(v);
      } catch { toast.error('Erro ao carregar dados financeiros'); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  // ── Cálculos ─────────────────────────────────────────────────────────────────
  const custosMes     = useMemo(() => valorPorMes(custos.map(c => ({ data: c.data, valor: c.valor }))),    [custos]);
  const receitasMes   = useMemo(() => valorPorMes(receitas.map(r => ({ data: r.data, valor: r.valor }))),  [receitas]);
  const viagensMes    = useMemo(() => viagemCustosPorMes(viagens), [viagens]);
  const despesasTotalMes = useMemo(() => custosMes.map((v, i) => v + viagensMes[i]), [custosMes, viagensMes]);

  const totalReceitasAno  = receitasMes.reduce((s, v) => s + v, 0);
  const totalDespesasAno  = despesasTotalMes.reduce((s, v) => s + v, 0);
  const saldoAno          = totalReceitasAno - totalDespesasAno;

  const dadosMensais = MESES.map((mes, i) => ({
    mes,
    Receitas: receitasMes[i],
    Despesas: despesasTotalMes[i],
    Saldo: receitasMes[i] - despesasTotalMes[i],
  }));

  // Pie: despesas por categoria (custos + viagens)
  const pieData = useMemo(() => {
    const mapa: Record<string, number> = {};
    custos.forEach(c => { mapa[c.categoria] = (mapa[c.categoria] || 0) + c.valor; });
    const totalViagens = viagens.reduce((s, v) => s + v.orcamento, 0);
    if (totalViagens > 0) mapa['viagem'] = (mapa['viagem'] || 0) + totalViagens;
    return Object.entries(mapa)
      .filter(([, v]) => v > 0)
      .map(([cat, valor]) => ({
        name: cat === 'viagem'
          ? 'Viagens'
          : custosService.CATEGORIAS_LABELS[cat as custosService.CategoriaCusto] || cat,
        value: valor,
        fill: cat === 'viagem'
          ? '#059669'
          : custosService.CATEGORIAS_CORES[cat as custosService.CategoriaCusto] || '#6B7280',
      }));
  }, [custos, viagens]);

  // Pie: receitas por categoria
  const pieReceitas = useMemo(() =>
    Object.entries(
      receitas.reduce((acc, r) => { acc[r.categoria] = (acc[r.categoria] || 0) + r.valor; return acc; }, {} as Record<string, number>)
    ).map(([cat, valor]) => ({
      name: receitasService.CATEGORIAS_RECEITA_LABELS[cat as receitasService.CategoriaReceita] || cat,
      value: valor,
      fill: receitasService.CATEGORIAS_RECEITA_CORES[cat as receitasService.CategoriaReceita] || '#6B7280',
    })),
  [receitas]);

  // ── Ações ─────────────────────────────────────────────────────────────────
  const handleSaveDespesa = async () => {
    if (!formDespesa.descricao || !formDespesa.valor) { toast.error('Preencha descrição e valor'); return; }
    try {
      const id = await custosService.criarCusto({
        descricao: formDespesa.descricao, valor: parseFloat(formDespesa.valor),
        categoria: formDespesa.categoria, tipo: formDespesa.tipo,
        data: new Date(formDespesa.data), notas: formDespesa.notas,
      });
      setCustos(p => [{ id, ...formDespesa, valor: parseFloat(formDespesa.valor), data: new Date(formDespesa.data) } as any, ...p]);
      setDialogDespesa(false);
      setFormDespesa({ descricao: '', valor: '', categoria: 'outros', tipo: 'variavel', data: new Date().toISOString().split('T')[0], notas: '' });
      toast.success('Gasto registrado!');
    } catch { toast.error('Erro ao salvar'); }
  };

  const handleSaveReceita = async () => {
    if (!formReceita.descricao || !formReceita.valor) { toast.error('Preencha descrição e valor'); return; }
    try {
      const id = await receitasService.criarReceita({
        descricao: formReceita.descricao, valor: parseFloat(formReceita.valor),
        categoria: formReceita.categoria, data: new Date(formReceita.data),
        recorrente: formReceita.recorrente, notas: formReceita.notas,
      });
      setReceitas(p => [{ id, ...formReceita, valor: parseFloat(formReceita.valor), data: new Date(formReceita.data) } as any, ...p]);
      setDialogReceita(false);
      setFormReceita({ descricao: '', valor: '', categoria: 'salario', data: new Date().toISOString().split('T')[0], recorrente: false, notas: '' });
      toast.success('Receita registrada!');
    } catch { toast.error('Erro ao salvar'); }
  };

  const handleDeleteCusto = async (id: string) => {
    if (!confirm('Excluir este gasto?')) return;
    await custosService.deletarCusto(id);
    setCustos(p => p.filter(c => c.id !== id));
    toast.success('Excluído!');
  };

  const handleDeleteReceita = async (id: string) => {
    if (!confirm('Excluir esta receita?')) return;
    await receitasService.deletarReceita(id);
    setReceitas(p => p.filter(r => r.id !== id));
    toast.success('Excluído!');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="h-8 w-8 animate-spin text-[var(--theme-accent)]" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Finanças Pessoais</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">{ANO_ATUAL} · Visão completa de receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setDialogReceita(true)} className="gap-2" style={{ background: '#059669', color: '#fff' }}>
            <ArrowUpCircle className="h-4 w-4" /> Receita
          </Button>
          <Button onClick={() => setDialogDespesa(true)} className="gap-2" style={{ background: '#EF4444', color: '#fff' }}>
            <ArrowDownCircle className="h-4 w-4" /> Despesa
          </Button>
        </div>
      </div>

      {/* ── Métricas do Ano ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Receitas no Ano', valor: totalReceitasAno, cor: '#059669', icon: TrendingUp },
          { label: 'Despesas no Ano', valor: totalDespesasAno, cor: '#EF4444', icon: TrendingDown },
          { label: 'Saldo do Ano', valor: saldoAno, cor: saldoAno >= 0 ? '#059669' : '#EF4444', icon: Wallet },
          { label: 'Gastos com Viagens', valor: viagensMes.reduce((s, v) => s + v, 0), cor: '#6366F1', icon: Plane },
        ].map(({ label, valor, cor, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${cor}15` }}>
                <Icon className="h-5 w-5" style={{ color: cor }} />
              </div>
              <div>
                <p className="text-xs text-[var(--theme-muted-foreground)]">{label}</p>
                <p className="text-lg font-bold" style={{ color: cor }}>
                  {valor < 0 ? '- ' : ''}R$ {Math.abs(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Abas ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--theme-background-secondary)' }}>
        {(['visao', 'despesas', 'receitas'] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-all"
            style={aba === a
              ? { background: 'var(--theme-card)', color: 'var(--theme-accent)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
              : { color: 'var(--theme-muted-foreground)' }}
          >
            {a === 'visao' ? 'Visão Geral' : a === 'despesas' ? 'Despesas' : 'Receitas'}
          </button>
        ))}
      </div>

      {/* ── Visão Geral ─────────────────────────────────────────────────────── */}
      {aba === 'visao' && (
        <div className="space-y-6">
          {/* Gráfico receitas vs despesas por mês */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: 'var(--theme-accent)' }} />
                Receitas vs Despesas — {ANO_ATUAL}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dadosMensais} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--theme-muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--theme-muted-foreground)' }}
                    tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<TooltipBRL />} />
                  <Legend />
                  <Bar dataKey="Receitas" fill="#059669" radius={[4,4,0,0]} />
                  <Bar dataKey="Despesas" fill="#EF4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Saldo mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Saldo Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dadosMensais} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--theme-muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--theme-muted-foreground)' }}
                    tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<TooltipBRL />} />
                  <Line
                    type="monotone" dataKey="Saldo" stroke="var(--theme-accent)"
                    strokeWidth={2} dot={{ r: 4, fill: 'var(--theme-accent)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pies lado a lado */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Despesas por Categoria</CardTitle></CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-sm text-[var(--theme-muted-foreground)]">Nenhuma despesa registrada</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Receitas por Categoria</CardTitle></CardHeader>
              <CardContent>
                {pieReceitas.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieReceitas} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {pieReceitas.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-sm text-[var(--theme-muted-foreground)]">Nenhuma receita registrada</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Custo mensal das viagens */}
          {viagens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-[#6366F1]" />
                  Custo Mensal com Viagens — {ANO_ATUAL}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={MESES.map((mes, i) => ({ mes, Viagens: viagensMes[i] }))} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--theme-muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--theme-muted-foreground)' }}
                      tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<TooltipBRL />} />
                    <Bar dataKey="Viagens" fill="#6366F1" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Despesas ─────────────────────────────────────────────────────────── */}
      {aba === 'despesas' && (
        <div className="space-y-3">
          {/* Viagens importadas */}
          {viagens.filter(v => v.orcamento > 0).map(v => (
            <Card key={v.id} className="opacity-90">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#6366F115' }}>
                    <Plane className="h-5 w-5 text-[#6366F1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--theme-foreground)]">Viagem: {v.destino}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs py-0" style={{ borderColor: '#6366F1', color: '#6366F1' }}>Viagem</Badge>
                      <span className="text-xs text-[var(--theme-muted-foreground)]">
                        {format(new Date(v.dataIda), "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-lg font-bold text-[#6366F1]">
                  R$ {v.orcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </CardContent>
            </Card>
          ))}

          {/* Gastos comuns */}
          {custos.length === 0 && viagens.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-[var(--theme-muted-foreground)] mb-3" />
              <p className="text-[var(--theme-muted-foreground)]">Nenhum gasto registrado</p>
              <Button className="mt-4 gap-2" style={{ background: 'var(--theme-accent)', color: '#fff' }} onClick={() => setDialogDespesa(true)}>
                <Plus className="h-4 w-4" /> Registrar Gasto
              </Button>
            </div>
          )}
          {custos.map(custo => {
            const cor = custosService.CATEGORIAS_CORES[custo.categoria] || '#6B7280';
            return (
              <Card key={custo.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${cor}20` }}>
                      <TrendingDown className="h-5 w-5" style={{ color: cor }} />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--theme-foreground)]">{custo.descricao}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs py-0" style={{ borderColor: cor, color: cor }}>
                          {custosService.CATEGORIAS_LABELS[custo.categoria]}
                        </Badge>
                        <Badge variant="outline" className="text-xs py-0">{custo.tipo === 'fixa' ? 'Fixo' : 'Variável'}</Badge>
                        <span className="text-xs text-[var(--theme-muted-foreground)]">
                          {format(new Date(custo.data), "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-500">
                      - R$ {custo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button onClick={() => handleDeleteCusto(custo.id!)} className="text-[var(--theme-muted-foreground)] hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Receitas ─────────────────────────────────────────────────────────── */}
      {aba === 'receitas' && (
        <div className="space-y-3">
          {receitas.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-[var(--theme-muted-foreground)] mb-3" />
              <p className="text-[var(--theme-muted-foreground)]">Nenhuma receita registrada</p>
              <Button className="mt-4 gap-2" style={{ background: '#059669', color: '#fff' }} onClick={() => setDialogReceita(true)}>
                <Plus className="h-4 w-4" /> Registrar Receita
              </Button>
            </div>
          )}
          {receitas.map(r => {
            const cor = receitasService.CATEGORIAS_RECEITA_CORES[r.categoria] || '#6B7280';
            return (
              <Card key={r.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${cor}20` }}>
                      <TrendingUp className="h-5 w-5" style={{ color: cor }} />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--theme-foreground)]">{r.descricao}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs py-0" style={{ borderColor: cor, color: cor }}>
                          {receitasService.CATEGORIAS_RECEITA_LABELS[r.categoria]}
                        </Badge>
                        {r.recorrente && <Badge variant="outline" className="text-xs py-0">Recorrente</Badge>}
                        <span className="text-xs text-[var(--theme-muted-foreground)]">
                          {format(new Date(r.data), "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-green-600">
                      + R$ {r.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button onClick={() => handleDeleteReceita(r.id!)} className="text-[var(--theme-muted-foreground)] hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Dialog: Nova Despesa ──────────────────────────────────────────────── */}
      <Dialog open={dialogDespesa} onOpenChange={setDialogDespesa}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Despesa</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Descrição *</Label>
              <Input placeholder="Ex: Conta de luz" value={formDespesa.descricao}
                onChange={e => setFormDespesa(f => ({ ...f, descricao: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Valor (R$) *</Label>
                <Input type="number" step="0.01" min="0" placeholder="0,00" value={formDespesa.valor}
                  onChange={e => setFormDespesa(f => ({ ...f, valor: e.target.value }))} className="mt-1" />
              </div>
              <div><Label>Data *</Label>
                <Input type="date" value={formDespesa.data}
                  onChange={e => setFormDespesa(f => ({ ...f, data: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Categoria</Label>
                <Select value={formDespesa.categoria} onValueChange={v => setFormDespesa(f => ({ ...f, categoria: v as any }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(custosService.CATEGORIAS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Tipo</Label>
                <Select value={formDespesa.tipo} onValueChange={v => setFormDespesa(f => ({ ...f, tipo: v as any }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixa">Fixo</SelectItem>
                    <SelectItem value="variavel">Variável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogDespesa(false)}>Cancelar</Button>
            <Button onClick={handleSaveDespesa} style={{ background: '#EF4444', color: '#fff' }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Nova Receita ──────────────────────────────────────────────── */}
      <Dialog open={dialogReceita} onOpenChange={setDialogReceita}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Receita</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Descrição *</Label>
              <Input placeholder="Ex: Salário março" value={formReceita.descricao}
                onChange={e => setFormReceita(f => ({ ...f, descricao: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Valor (R$) *</Label>
                <Input type="number" step="0.01" min="0" placeholder="0,00" value={formReceita.valor}
                  onChange={e => setFormReceita(f => ({ ...f, valor: e.target.value }))} className="mt-1" />
              </div>
              <div><Label>Data *</Label>
                <Input type="date" value={formReceita.data}
                  onChange={e => setFormReceita(f => ({ ...f, data: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Categoria</Label>
                <Select value={formReceita.categoria} onValueChange={v => setFormReceita(f => ({ ...f, categoria: v as any }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(receitasService.CATEGORIAS_RECEITA_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formReceita.recorrente}
                    onChange={e => setFormReceita(f => ({ ...f, recorrente: e.target.checked }))}
                    className="h-4 w-4 rounded" />
                  <span className="text-sm text-[var(--theme-foreground)]">Recorrente</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogReceita(false)}>Cancelar</Button>
            <Button onClick={handleSaveReceita} style={{ background: '#059669', color: '#fff' }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
