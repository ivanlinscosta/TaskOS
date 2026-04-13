import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plane, ArrowLeft, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import * as viagensService from '../../../services/viagens-service';

export function NovaViagem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [novaAtividade, setNovaAtividade] = useState('');

  const [form, setForm] = useState({
    destino: '',
    descricao: '',
    dataIda: '',
    dataVolta: '',
    orcamento: '',
    status: 'planejada' as viagensService.Viagem['status'],
    atividades: [] as string[],
    notas: '',
  });

  const setField = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const addAtividade = () => {
    if (!novaAtividade.trim()) return;
    setForm((f) => ({ ...f, atividades: [...f.atividades, novaAtividade.trim()] }));
    setNovaAtividade('');
  };

  const removeAtividade = (idx: number) => {
    setForm((f) => ({ ...f, atividades: f.atividades.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destino || !form.dataIda || !form.orcamento) {
      toast.error('Preencha os campos obrigatórios: destino, data de ida e orçamento');
      return;
    }

    setIsLoading(true);
    try {
      await viagensService.criarViagem({
        destino: form.destino,
        descricao: form.descricao,
        dataIda: new Date(form.dataIda),
        dataVolta: form.dataVolta ? new Date(form.dataVolta) : undefined,
        orcamento: parseFloat(form.orcamento),
        gastoReal: 0,
        status: form.status,
        atividades: form.atividades,
        notas: form.notas,
      });
      toast.success('Viagem cadastrada com sucesso!');
      navigate('/pessoal/viagens');
    } catch {
      toast.error('Erro ao cadastrar viagem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/pessoal/viagens')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Nova Viagem</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">Planeje sua próxima aventura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" style={{ color: 'var(--theme-accent)' }} />
                  Informações da Viagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="destino">Destino *</Label>
                  <Input
                    id="destino"
                    placeholder="Ex: Lisboa, Portugal"
                    value={form.destino}
                    onChange={(e) => setField('destino', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Objetivo, motivação ou detalhes da viagem..."
                    value={form.descricao}
                    onChange={(e) => setField('descricao', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataIda">Data de Ida *</Label>
                    <Input
                      id="dataIda"
                      type="date"
                      value={form.dataIda}
                      onChange={(e) => setField('dataIda', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataVolta">Data de Volta</Label>
                    <Input
                      id="dataVolta"
                      type="date"
                      value={form.dataVolta}
                      onChange={(e) => setField('dataVolta', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orcamento">Orçamento (R$) *</Label>
                    <Input
                      id="orcamento"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={form.orcamento}
                      onChange={(e) => setField('orcamento', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setField('status', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planejada">Planejada</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    placeholder="Anotações importantes, dicas, lembretes..."
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades Planejadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Visitar Torre de Belém"
                    value={novaAtividade}
                    onChange={(e) => setNovaAtividade(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAtividade())}
                  />
                  <Button type="button" onClick={addAtividade} style={{ background: 'var(--theme-accent)', color: '#fff' }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.atividades.length > 0 && (
                  <div className="space-y-2">
                    {form.atividades.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg px-3 py-2"
                        style={{ background: 'var(--theme-background-secondary)' }}
                      >
                        <span className="text-sm text-[var(--theme-foreground)]">{a}</span>
                        <button
                          type="button"
                          onClick={() => removeAtividade(i)}
                          className="text-[var(--theme-muted-foreground)] hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Painel lateral */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  style={{ background: 'var(--theme-accent)', color: '#fff' }}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Viagem'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/pessoal/viagens')}
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--theme-muted-foreground)]">
                  Você pode registrar gastos relacionados a esta viagem na seção de Finanças após salvá-la.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
