import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, BookOpen, CalendarDays, ClipboardList, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockAlunos } from '../../../lib/mock-data';

export function NovaAvaliacao() {
  const navigate = useNavigate();
  const { id } = useParams();
  const aluno = mockAlunos.find(a => a.id === id);

  const [formData, setFormData] = useState({
    disciplina: '',
    tipo: '',
    nota: '',
    data: new Date().toISOString().split('T')[0],
    comentario: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova avaliação:', { alunoId: id, ...formData });
    navigate('/fiap/alunos');
  };

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/fiap/alunos')}
          className="h-9 w-9 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-foreground)]">Nova Avaliação</h1>
          <p className="text-sm text-[var(--theme-muted-foreground)]">
            {aluno ? `Registrar avaliação para ${aluno.nome}` : 'Carregando...'}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-[28px] border border-[var(--theme-border)] bg-gradient-to-b from-[var(--theme-card)] to-[var(--theme-background-secondary)]">
        <div className="h-2 bg-gradient-to-r from-[var(--theme-accent)] to-blue-400" />

        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Dados da Avaliação</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="disciplina" className="text-sm">Disciplina *</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-accent)]" />
                  <Input
                    id="disciplina"
                    value={formData.disciplina}
                    onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                    placeholder="Ex: Machine Learning"
                    required
                    className="h-10 rounded-xl pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm">Tipo de Avaliação *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  required
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prova">Prova</SelectItem>
                    <SelectItem value="Trabalho">Trabalho</SelectItem>
                    <SelectItem value="Projeto">Projeto</SelectItem>
                    <SelectItem value="Apresentação">Apresentação</SelectItem>
                    <SelectItem value="Checkpoint">Checkpoint</SelectItem>
                    <SelectItem value="Global Solution">Global Solution</SelectItem>
                    <SelectItem value="Challenge">Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nota" className="text-sm">Nota (0-10) *</Label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-accent)]" />
                  <Input
                    id="nota"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.nota}
                    onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                    required
                    className="h-10 rounded-xl pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data" className="text-sm">Data *</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-accent)]" />
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                    className="h-10 rounded-xl pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comentario" className="text-sm">Comentários/Observações</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-[var(--theme-accent)]" />
                  <Textarea
                    id="comentario"
                    value={formData.comentario}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    placeholder="Comentários sobre o desempenho do aluno nesta avaliação"
                    rows={5}
                    className="rounded-xl pl-10 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="theme" className="gap-2 rounded-xl">
                <Save className="w-4 h-4" />
                Salvar Avaliação
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate('/fiap/alunos')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}