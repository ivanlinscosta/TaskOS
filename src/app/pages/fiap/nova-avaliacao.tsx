import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
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
    // Aqui você integraria com Firebase/backend
    console.log('Nova avaliação:', { alunoId: id, ...formData });
    navigate('/fiap/alunos');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/fiap/alunos')}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[var(--theme-foreground)]">
            Nova Avaliação
          </h1>
          <p className="text-xs text-[var(--theme-muted-foreground)]">
            {aluno ? `Registrar avaliação para ${aluno.nome}` : 'Carregando...'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dados da Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="disciplina" className="text-sm">Disciplina *</Label>
                <Input
                  id="disciplina"
                  value={formData.disciplina}
                  onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                  placeholder="Ex: Machine Learning"
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm">Tipo de Avaliação *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  required
                >
                  <SelectTrigger className="h-9 text-sm">
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
                <Input
                  id="nota"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.nota}
                  onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data" className="text-sm">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comentario" className="text-sm">Comentários/Observações</Label>
                <Textarea
                  id="comentario"
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  placeholder="Comentários sobre o desempenho do aluno nesta avaliação"
                  rows={4}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="theme" className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Avaliação
              </Button>
              <Button
                type="button"
                variant="outline"
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
