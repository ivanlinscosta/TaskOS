import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import * as analistasService from '../../../services/analistas-service';

export function NovoAnalista() {
  const navigate = useNavigate();
  const location = useLocation();
  const aiData = location.state as any;
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    funcao: '',
    squad: '',
    senioridade: '',
    dataAdmissao: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    skills: '',
    observacoes: '',
  });

  useEffect(() => {
    if (aiData) {
      setFormData(prev => ({
        ...prev,
        nome: aiData.nome || prev.nome,
        email: aiData.email || prev.email,
        telefone: aiData.telefone || prev.telefone,
        funcao: aiData.funcao || prev.funcao,
        dataAdmissao: aiData.dataAdmissao || prev.dataAdmissao,
        observacoes: aiData.observacoes || prev.observacoes,
      }));
    }
  }, [aiData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.funcao) {
      toast.error('Preencha nome, email e função');
      return;
    }

    try {
      setIsSaving(true);
      await analistasService.criarAnalista({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        funcao: formData.funcao,
        squad: formData.squad,
        senioridade: formData.senioridade,
        dataAdmissao: formData.dataAdmissao ? new Date(formData.dataAdmissao) : new Date(),
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento) : undefined,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        observacoes: formData.observacoes,
      });
      toast.success('Analista cadastrado com sucesso!');
      navigate('/itau/analistas');
    } catch (error) {
      console.error('Erro ao cadastrar analista:', error);
      toast.error('Erro ao cadastrar analista');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/itau/analistas')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Novo Analista</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">Cadastre um novo analista no time</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader><CardTitle>Informações Pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input id="nome" placeholder="Ex: Maria Silva Santos" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input id="dataNascimento" type="date" value={formData.dataNascimento} onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo *</Label>
                <Input id="email" type="email" placeholder="maria.silva@itau.com.br" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input id="telefone" type="tel" placeholder="(11) 98765-4321" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle>Informações Profissionais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="funcao">Função *</Label>
                <Input id="funcao" placeholder="Ex: Analista de Sistemas" value={formData.funcao} onChange={(e) => setFormData({ ...formData, funcao: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senioridade">Senioridade *</Label>
                <select id="senioridade" className="w-full px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]" value={formData.senioridade} onChange={(e) => setFormData({ ...formData, senioridade: e.target.value })} required>
                  <option value="">Selecione...</option>
                  <option value="Junior">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Senior">Sênior</option>
                  <option value="Especialista">Especialista</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="squad">Squad *</Label>
                <Input id="squad" placeholder="Ex: Payments Squad" value={formData.squad} onChange={(e) => setFormData({ ...formData, squad: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                <Input id="dataAdmissao" type="date" value={formData.dataAdmissao} onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades Principais</Label>
              <Input id="skills" placeholder="Ex: React, Node.js, TypeScript, AWS" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
              <p className="text-xs text-[var(--theme-muted-foreground)]">Separe as habilidades por vírgula</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input id="endereco" placeholder="Rua, número, complemento" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" placeholder="Ex: São Paulo" value={formData.cidade} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" placeholder="Ex: SP" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} maxLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" placeholder="00000-000" value={formData.cep} onChange={(e) => setFormData({ ...formData, cep: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle>Observações Adicionais</CardTitle></CardHeader>
          <CardContent>
            <Textarea id="observacoes" placeholder="Informações adicionais sobre o analista..." value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} rows={4} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/itau/analistas')}>Cancelar</Button>
          <Button type="submit" variant="theme" disabled={isSaving} className="gap-2">
            {isSaving && <Loader className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Salvando...' : 'Cadastrar Analista'}
          </Button>
        </div>
      </form>
    </div>
  );
}
