import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { db } from '../../../stores/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

export function NovoAluno() {
  const navigate = useNavigate();
  const location = useLocation();
  const aiData = location.state as any;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    turma: '',
    periodo: '',
    curso: '',
    ra: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: '',
  });

  // Função para cadastrar o aluno
  const cadastrarAluno = async () => {
    try {
      await addDoc(collection(db, 'alunos'), formData);
      alert('Aluno cadastrado com sucesso!');
      navigate('/fiap/alunos');
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      alert('Ocorreu um erro ao cadastrar o aluno. Tente novamente.');
    }
  }

    // Pré-preencher com dados da IA se disponíveis
    useEffect(() => {
      if (aiData) {
        setFormData(prev => ({
          ...prev,
          nome: aiData.nome || prev.nome,
          email: aiData.email || prev.email,
          telefone: aiData.telefone || prev.telefone,
          curso: aiData.curso || prev.curso,
          ra: aiData.matricula || prev.ra,
          observacoes: aiData.observacoes || prev.observacoes,
        }));
      }
    }, [aiData]);

    const handleSubmit = (e: React.FormEvent) => {
      cadastrarAluno();
      e.preventDefault();
      console.log('Novo aluno:', formData);
    };

    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/fiap/alunos')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Novo Aluno</h1>
            <p className="text-[var(--theme-muted-foreground)] mt-1">
              Cadastre um novo aluno no sistema
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informações Pessoais */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: João Silva Santos"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao.silva@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Acadêmicas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações Acadêmicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ra">RA (Registro Acadêmico) *</Label>
                  <Input
                    id="ra"
                    placeholder="Ex: RM123456"
                    value={formData.ra}
                    onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curso">Curso *</Label>
                  <Input
                    id="curso"
                    placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                    value={formData.curso}
                    onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="turma">Turma *</Label>
                  <Input
                    id="turma"
                    placeholder="Ex: 2TDSPN"
                    value={formData.turma}
                    onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período *</Label>
                  <select
                    id="periodo"
                    className="w-full px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
                    value={formData.periodo}
                    onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, complemento"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    placeholder="Ex: São Paulo"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    placeholder="Ex: SP"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Observações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o aluno..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/fiap/alunos')}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="theme">
              Cadastrar Aluno
            </Button>
          </div>
        </form>
      </div>
    );
}