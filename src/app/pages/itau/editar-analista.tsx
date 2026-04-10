import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import * as analistasService from '../../../services/analistas-service';
import { mockAnalistas } from '../../../lib/mock-data';

export function EditarAnalista() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [analista, setAnalista] = useState<any>(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    funcao: '',
    squad: '',
    senioridade: '',
    dataAdmissao: '',
    salario: '',
    observacoes: ''
  });

  // Carregar analista ao montar
  useEffect(() => {
    if (id) {
      carregarAnalista();
    }
  }, [id]);

  const carregarAnalista = async () => {
    try {
      setIsLoading(true);
      const analistaFirebase = await analistasService.buscarAnalistaPorId(id || '');

      if (analistaFirebase) {
        setAnalista(analistaFirebase);
        setFormData({
          nome: analistaFirebase.nome || '',
          email: analistaFirebase.email || '',
          telefone: analistaFirebase.telefone || '',
          funcao: analistaFirebase.funcao || '',
          squad: analistaFirebase.squad || '',
          senioridade: analistaFirebase.senioridade || '',
          dataAdmissao: analistaFirebase.dataAdmissao 
            ? new Date(analistaFirebase.dataAdmissao).toISOString().split('T')[0]
            : '',
          salario: analistaFirebase.salario?.toString() || '',
          observacoes: analistaFirebase.observacoes || ''
        });
      } else {
        // Fallback para mock
        const analistaMock = mockAnalistas.find(a => a.id === id);
        if (analistaMock) {
          setAnalista(analistaMock);
          setFormData({
            nome: analistaMock.nome || '',
            email: analistaMock.email || '',
            telefone: analistaMock.telefone || '',
            funcao: analistaMock.funcao || '',
            squad: analistaMock.squad || '',
            senioridade: analistaMock.senioridade || '',
            dataAdmissao: analistaMock.dataAdmissao
              ? new Date(analistaMock.dataAdmissao).toISOString().split('T')[0]
              : '',
            salario: analistaMock.salario?.toString() || '',
            observacoes: analistaMock.observacoes || ''
          });
        } else {
          toast.error('Analista não encontrado');
          navigate('/itau/analistas');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar analista:', error);
      toast.error('Erro ao carregar analista');
      navigate('/itau/analistas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error('ID do analista não encontrado');
      return;
    }

    try {
      setIsSaving(true);

      await analistasService.atualizarAnalista(id, {
        ...formData,
        dataAdmissao: formData.dataAdmissao ? new Date(formData.dataAdmissao) : undefined,
        salario: formData.salario ? parseFloat(formData.salario) : undefined,
      });

      toast.success('Analista atualizado com sucesso!');
      navigate('/itau/analistas');
    } catch (error) {
      console.error('Erro ao atualizar analista:', error);
      toast.error('Erro ao atualizar analista');
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

  if (!analista) {
    return null;
  }

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/itau/analistas')}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[var(--theme-foreground)]">
            Editar Analista
          </h1>
          <p className="text-xs text-[var(--theme-muted-foreground)]">
            Atualize as informações do analista
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informações do Analista</CardTitle>
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
                <Label htmlFor="email" className="text-sm">Email Corporativo *</Label>
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
                <Label htmlFor="funcao" className="text-sm">Função *</Label>
                <Input
                  id="funcao"
                  value={formData.funcao}
                  onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="squad" className="text-sm">Squad</Label>
                <Input
                  id="squad"
                  value={formData.squad}
                  onChange={(e) => setFormData({ ...formData, squad: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senioridade" className="text-sm">Senioridade</Label>
                <Input
                  id="senioridade"
                  value={formData.senioridade}
                  onChange={(e) => setFormData({ ...formData, senioridade: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAdmissao" className="text-sm">Data de Admissão</Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={formData.dataAdmissao}
                  onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salario" className="text-sm">Salário</Label>
                <Input
                  id="salario"
                  type="number"
                  step="0.01"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
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
                onClick={() => navigate('/itau/analistas')}
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
