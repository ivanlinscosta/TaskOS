import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  Wallet,
  TrendingDown,
  Trash2,
  Loader,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import * as custosService from '../../../services/custos-service';

export function Custos() {
  const navigate = useNavigate();
  const [custos, setCustos] = useState<custosService.Custo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

  useEffect(() => {
    carregarCustos();
  }, []);

  const carregarCustos = async () => {
    setIsLoading(true);
    try {
      setCustos(await custosService.listarCustos());
    } catch {
      toast.error('Erro ao carregar gastos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este gasto?')) return;
    try {
      await custosService.deletarCusto(id);
      setCustos((prev) => prev.filter((c) => c.id !== id));
      toast.success('Gasto excluído!');
    } catch {
      toast.error('Erro ao excluir gasto');
    }
  };

  const custosFiltrados = custos.filter((c) => {
    if (filtroCategoria !== 'todos' && c.categoria !== filtroCategoria) return false;
    if (filtroTipo !== 'todos' && c.tipo !== filtroTipo) return false;
    return true;
  });

  const totalFiltrado = custosFiltrados.reduce((sum, c) => sum + c.valor, 0);
  const totalGeral = custos.reduce((sum, c) => sum + c.valor, 0);

  // Agrupamento por categoria para o resumo
  const porCategoria = custos.reduce((acc, c) => {
    acc[c.categoria] = (acc[c.categoria] || 0) + c.valor;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-[var(--theme-accent)]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Finanças Pessoais</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            {custos.length} lançamentos • Total: R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button
          onClick={() => navigate('/pessoal/custos/novo')}
          className="gap-2"
          style={{ background: 'var(--theme-accent)', color: '#fff' }}
        >
          <Plus className="h-4 w-4" /> Registrar Gasto
        </Button>
      </div>

      {/* Resumo por Categoria */}
      {custos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(porCategoria)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([cat, valor]) => {
              const cor = custosService.CATEGORIAS_CORES[cat as custosService.CategoriaCusto] || '#6B7280';
              return (
                <Card key={cat}>
                  <CardContent className="p-4">
                    <div
                      className="h-2 w-full rounded-full mb-2"
                      style={{ background: `${cor}33` }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${totalGeral > 0 ? (valor / totalGeral) * 100 : 0}%`,
                          background: cor,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[var(--theme-muted-foreground)]">
                      {custosService.CATEGORIAS_LABELS[cat as custosService.CategoriaCusto]}
                    </p>
                    <p className="text-sm font-bold text-[var(--theme-foreground)]">
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--theme-muted-foreground)]" />
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as categorias</SelectItem>
              {Object.entries(custosService.CATEGORIAS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="fixa">Fixo</SelectItem>
            <SelectItem value="variavel">Variável</SelectItem>
          </SelectContent>
        </Select>

        {(filtroCategoria !== 'todos' || filtroTipo !== 'todos') && (
          <span className="text-sm text-[var(--theme-muted-foreground)] self-center">
            {custosFiltrados.length} resultado{custosFiltrados.length !== 1 ? 's' : ''} •
            R$ {totalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>

      {/* Lista de Gastos */}
      {custosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Wallet className="h-16 w-16 text-[var(--theme-muted-foreground)] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--theme-foreground)] mb-2">
            {custos.length === 0 ? 'Nenhum gasto registrado' : 'Nenhum gasto com esses filtros'}
          </h3>
          {custos.length === 0 && (
            <Button
              onClick={() => navigate('/pessoal/custos/novo')}
              style={{ background: 'var(--theme-accent)', color: '#fff' }}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Registrar Primeiro Gasto
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {custosFiltrados.map((custo) => {
            const cor = custosService.CATEGORIAS_CORES[custo.categoria] || '#6B7280';
            return (
              <Card key={custo.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `${cor}20` }}
                      >
                        <TrendingDown className="h-5 w-5" style={{ color: cor }} />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--theme-foreground)]">{custo.descricao}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="outline"
                            className="text-xs py-0"
                            style={{ borderColor: cor, color: cor }}
                          >
                            {custosService.CATEGORIAS_LABELS[custo.categoria]}
                          </Badge>
                          <Badge variant="outline" className="text-xs py-0">
                            {custo.tipo === 'fixa' ? 'Fixo' : 'Variável'}
                          </Badge>
                          <span className="text-xs text-[var(--theme-muted-foreground)]">
                            {format(new Date(custo.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        {custo.notas && (
                          <p className="text-xs text-[var(--theme-muted-foreground)] mt-1">{custo.notas}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-red-500">
                        - R$ {custo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleDelete(custo.id!)}
                        className="text-[var(--theme-muted-foreground)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
