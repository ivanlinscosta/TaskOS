import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { mockAlunos } from '../../../lib/mock-data';

export function EditarAluno() {
  const navigate = useNavigate();
  const { id } = useParams();
  const aluno = mockAlunos.find(a => a.id === id);

  const [formData, setFormData] = useState({
    nome: aluno?.nome || '',
    email: aluno?.email || '',
    telefone: '',
    curso: aluno?.curso || '',
    matricula: '',
    observacoes: aluno?.observacoes || ''
  });

  useEffect(() => {
    if (!aluno) {
      navigate('/fiap/alunos');
    }
  }, [aluno, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você integraria com Firebase/backend
    console.log('Aluno atualizado:', formData);
    navigate('/fiap/alunos');
  };

  if (!aluno) return null;

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
            Editar Aluno
          </h1>
          <p className="text-xs text-[var(--theme-muted-foreground)]">
            Atualize as informações do aluno
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informações do Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula" className="text-sm">Matrícula</Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  placeholder="RM12345"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="curso" className="text-sm">Curso *</Label>
                <Input
                  id="curso"
                  value={formData.curso}
                  onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes" className="text-sm">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={4}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="theme" className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
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
