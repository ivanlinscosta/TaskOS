import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Bell, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { useTheme } from '../../lib/theme-context';
import { AvatarUploadDialog } from '../components/AvatarUploadDialog';

export function Perfil() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    cargo: 'Professor / Analista Sênior',
    departamentoFIAP: 'Tecnologia da Informação',
    departamentoItau: 'Digital Banking',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    bio: 'Profissional híbrido atuando na área de tecnologia e educação.',
    dataNascimento: '1990-05-15',
  });

  const [configuracoes, setConfiguracoes] = useState({
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesAula: true,
    notificacoesReuniao: true,
    notificacoesTarefa: true,
    temaAutomatico: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar o perfil
    console.log('Perfil atualizado:', formData);
    alert('Perfil atualizado com sucesso!');
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar as configurações
    console.log('Configurações atualizadas:', configuracoes);
    alert('Configurações atualizadas com sucesso!');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Meu Perfil</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
      </div>

      {/* Avatar e Informações Rápidas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[var(--theme-foreground)]">{formData.nome}</h2>
              <p className="text-[var(--theme-muted-foreground)] mt-1">{formData.cargo}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <div className="px-3 py-1 rounded-full bg-[#6A0DAD]/10 text-[#6A0DAD] text-sm font-medium">
                  FIAP - {formData.departamentoFIAP}
                </div>
                <div className="px-3 py-1 rounded-full bg-[#EC7000]/10 text-[#EC7000] text-sm font-medium">
                  Itaú - {formData.departamentoItau}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsAvatarDialogOpen(true)}>
              Alterar Foto
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Informações Pessoais */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--theme-accent)]" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
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
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-muted-foreground)]" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-muted-foreground)]" />
                  <Input
                    id="telefone"
                    type="tel"
                    className="pl-9"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações Profissionais */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[var(--theme-accent)]" />
              Informações Profissionais
            </CardTitle>
            <CardDescription>Suas funções e departamentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo *</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamentoFIAP">Departamento FIAP *</Label>
                <Input
                  id="departamentoFIAP"
                  value={formData.departamentoFIAP}
                  onChange={(e) => setFormData({ ...formData, departamentoFIAP: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamentoItau">Departamento Itaú *</Label>
                <Input
                  id="departamentoItau"
                  value={formData.departamentoItau}
                  onChange={(e) => setFormData({ ...formData, departamentoItau: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--theme-accent)]" />
              Endereço
            </CardTitle>
            <CardDescription>Seu endereço residencial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Cancelar
          </Button>
          <Button type="submit" variant="theme">
            Salvar Alterações
          </Button>
        </div>
      </form>

      <Separator className="my-8" />

      {/* Configurações */}
      <form onSubmit={handleConfigSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--theme-accent)]" />
              Notificações
            </CardTitle>
            <CardDescription>Configure suas preferências de notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoesEmail">Notificações por E-mail</Label>
                <p className="text-sm text-[var(--theme-muted-foreground)]">
                  Receba atualizações importantes por e-mail
                </p>
              </div>
              <Switch
                id="notificacoesEmail"
                checked={configuracoes.notificacoesEmail}
                onCheckedChange={(checked) =>
                  setConfiguracoes({ ...configuracoes, notificacoesEmail: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoesPush">Notificações Push</Label>
                <p className="text-sm text-[var(--theme-muted-foreground)]">
                  Receba notificações em tempo real no navegador
                </p>
              </div>
              <Switch
                id="notificacoesPush"
                checked={configuracoes.notificacoesPush}
                onCheckedChange={(checked) =>
                  setConfiguracoes({ ...configuracoes, notificacoesPush: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoesAula">Notificações de Aulas</Label>
                <p className="text-sm text-[var(--theme-muted-foreground)]">
                  Alertas sobre aulas agendadas e materiais
                </p>
              </div>
              <Switch
                id="notificacoesAula"
                checked={configuracoes.notificacoesAula}
                onCheckedChange={(checked) =>
                  setConfiguracoes({ ...configuracoes, notificacoesAula: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoesReuniao">Notificações de Reuniões</Label>
                <p className="text-sm text-[var(--theme-muted-foreground)]">
                  Lembretes de reuniões corporativas
                </p>
              </div>
              <Switch
                id="notificacoesReuniao"
                checked={configuracoes.notificacoesReuniao}
                onCheckedChange={(checked) =>
                  setConfiguracoes({ ...configuracoes, notificacoesReuniao: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificacoesTarefa">Notificações de Tarefas</Label>
                <p className="text-sm text-[var(--theme-muted-foreground)]">
                  Alertas de prazos e tarefas pendentes
                </p>
              </div>
              <Switch
                id="notificacoesTarefa"
                checked={configuracoes.notificacoesTarefa}
                onCheckedChange={(checked) =>
                  setConfiguracoes({ ...configuracoes, notificacoesTarefa: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[var(--theme-accent)]" />
              Aparência
            </CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="temaAutomatico">Tema Automático</Label>
                <p className="text-sm text-[var(--theme-muted-foreground)]">
                  Alterna automaticamente entre FIAP e Itaú baseado no contexto
                </p>
              </div>
              <Switch
                id="temaAutomatico"
                checked={configuracoes.temaAutomatico}
                onCheckedChange={(checked) =>
                  setConfiguracoes({ ...configuracoes, temaAutomatico: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Tema Preferido</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toggleTheme('fiap')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'fiap'
                      ? 'border-[#6A0DAD] bg-[#6A0DAD]/10'
                      : 'border-[var(--theme-border)] hover:border-[#6A0DAD]/50'
                  }`}
                >
                  <div className="font-semibold text-[var(--theme-foreground)] mb-1">FIAP</div>
                  <div className="text-xs text-[var(--theme-muted-foreground)]">
                    Roxo neon futurista
                  </div>
                  <div className="flex gap-1 mt-2">
                    <div className="w-full h-2 rounded bg-[#000000]" />
                    <div className="w-full h-2 rounded bg-[#6A0DAD]" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleTheme('itau')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'itau'
                      ? 'border-[#EC7000] bg-[#EC7000]/10'
                      : 'border-[var(--theme-border)] hover:border-[#EC7000]/50'
                  }`}
                >
                  <div className="font-semibold text-[var(--theme-foreground)] mb-1">Itaú</div>
                  <div className="text-xs text-[var(--theme-muted-foreground)]">
                    Laranja corporativo
                  </div>
                  <div className="flex gap-1 mt-2">
                    <div className="w-full h-2 rounded bg-[#EC7000]" />
                    <div className="w-full h-2 rounded bg-[#003A8F]" />
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="theme">
            Salvar Configurações
          </Button>
        </div>
      </form>

      <AvatarUploadDialog
        open={isAvatarDialogOpen}
        onOpenChange={setIsAvatarDialogOpen}
        currentAvatar={avatarUrl}
        onAvatarChange={setAvatarUrl}
        fallback="JS"
      />
    </div>
  );
}