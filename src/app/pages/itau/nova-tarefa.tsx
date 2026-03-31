import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

export function NovaTarefaItau() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    categoria: '',
    dataEntrega: '',
    responsavel: '',
    status: 'todo',
    squad: '',
    sprint: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar a tarefa
    console.log('Nova tarefa:', formData);
    navigate('/itau/kanban');
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/itau/kanban')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Nova Tarefa</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Adicione uma nova tarefa ao kanban corporativo
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Implementar API de pagamentos"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes da tarefa..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
                rows={4}
              />
            </div>

            {/* Squad e Sprint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="squad">Squad *</Label>
                <Input
                  id="squad"
                  placeholder="Ex: Payments Squad"
                  value={formData.squad}
                  onChange={(e) => setFormData({ ...formData, squad: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sprint">Sprint</Label>
                <Input
                  id="sprint"
                  placeholder="Ex: Sprint 42"
                  value={formData.sprint}
                  onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
                />
              </div>
            </div>

            {/* Prioridade e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <select
                  id="prioridade"
                  className="w-full px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
                  value={formData.prioridade}
                  onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                  required
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <select
                  id="categoria"
                  className="w-full px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Design">Design</option>
                  <option value="QA">QA</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                </select>
              </div>
            </div>

            {/* Data de Entrega e Responsável */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataEntrega">Data de Entrega *</Label>
                <Input
                  id="dataEntrega"
                  type="date"
                  value={formData.dataEntrega}
                  onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  placeholder="Nome do responsável"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status Inicial *</Label>
              <select
                id="status"
                className="w-full px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="todo">A Fazer</option>
                <option value="in-progress">Em Progresso</option>
                <option value="review">Em Revisão</option>
                <option value="done">Concluído</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/itau/kanban')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="theme">
            Criar Tarefa
          </Button>
        </div>
      </form>
    </div>
  );
}
