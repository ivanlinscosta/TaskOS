import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import * as alunosService from '../../../services/alunos-service';
import { mockAlunos } from '../../../lib/mock-data';

export function EditarAluno() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aluno, setAluno] = useState<any>(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    curso: '',
    turma: '',
    periodo: '',
    ra: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: ''
  });

  // Carregar aluno ao montar
  useEffect(() => {
    if (id) {
      carregarAluno();
    }
  }, [id]);

  const carregarAluno = async () => {
    try {
      setIsLoading(true);
      const alunoFirebase = await alunosService.buscarAlunoPorId(id || '');
      
      if (alunoFirebase) {
        setAluno(alunoFirebase);
        setFormData({
          nome: alunoFirebase.nome || '',
          email: alunoFirebase.email || '',
          telefone: alunoFirebase.telefone || '',
          curso: alunoFirebase.curso || '',
          turma: alunoFirebase.turma || '',
          periodo: alunoFirebase.periodo || '',
          ra: alunoFirebase.ra || '',
          dataNascimento: alunoFirebase.dataNascimento || '',
          endereco: alunoFirebase.endereco || '',
          cidade: alunoFirebase.cidade || '',
          estado: alunoFirebase.estado || '',
          cep: alunoFirebase.cep || '',
          observacoes: alunoFirebase.observacoes || ''
        });
      } else {
        // Fallback para mock
        const alunoMock = mockAlunos.find(a => a.id === id);
        if (alunoMock) {
          setAluno(alunoMock);
          setFormData({
            nome: alunoMock.nome || '',
            email: alunoMock.email || '',
            telefone: alunoMock.telefone || '',
            curso: alunoMock.curso || '',
            turma: alunoMock.turma || '',
            periodo: alunoMock.periodo || '',
            ra: alunoMock.ra || '',
            dataNascimento: '',
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            observacoes: alunoMock.observacoes || ''
          });
        } else {
          toast.error('Aluno não encontrado');
          navigate('/fiap/alunos');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar aluno:', error);
      toast.error('Erro ao carregar aluno');
      navigate('/fiap/alunos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error('ID do aluno não encontrado');
      return;
    }

    try {
      setIsSaving(true);
      
      await alunosService.atualizarAluno(id, formData);
      
      toast.success('Aluno atualizado com sucesso!');
      navigate('/fiap/alunos');
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast.error('Erro ao atualizar aluno');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-[var(--theme-accent)]" />
      </div>
    );
  }

  if (!aluno) {
    return null;
  }

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
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
                <Label htmlFor="curso" className="text-sm">Curso *</Label>
                <Input
                  id="curso"
                  value={formData.curso}
                  onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turma" className="text-sm">Turma</Label>
                <Input
                  id="turma"
                  value={formData.turma}
                  onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo" className="text-sm">Período</Label>
                <Input
                  id="periodo"
                  value={formData.periodo}
                  onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ra" className="text-sm">RA</Label>
                <Input
                  id="ra"
                  value={formData.ra}
                  onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento" className="text-sm">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-sm">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep" className="text-sm">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="text-sm"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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
