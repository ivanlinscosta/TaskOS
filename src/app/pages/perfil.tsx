import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Loader, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { AvatarUploadDialog } from '../components/AvatarUploadDialog';
import { toast } from 'sonner';

export function Perfil() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user: firebaseUser, userProfile, updateUserProfileData, refreshProfile } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamentoFIAP: '',
    departamentoItau: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    bio: '',
    dataNascimento: '',
  });

  // Carregar dados do perfil do Firestore
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nome: userProfile.nome || firebaseUser?.displayName || '',
        email: userProfile.email || firebaseUser?.email || '',
        telefone: userProfile.telefone || '',
        cargo: userProfile.cargo || '',
        departamentoFIAP: userProfile.departamentoFIAP || '',
        departamentoItau: userProfile.departamentoItau || '',
        endereco: userProfile.endereco || '',
        cidade: userProfile.cidade || '',
        estado: userProfile.estado || '',
        cep: userProfile.cep || '',
        bio: userProfile.bio || '',
        dataNascimento: userProfile.dataNascimento || '',
      });
      setAvatarUrl(userProfile.avatar || firebaseUser?.photoURL || '');
      setIsLoading(false);
    } else if (firebaseUser) {
      setFormData(prev => ({
        ...prev,
        nome: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
      }));
      setAvatarUrl(firebaseUser.photoURL || '');
      setIsLoading(false);
    }
  }, [userProfile, firebaseUser]);

  const handleAvatarChange = async (newAvatarUrl: string) => {
    try {
      // Salvar APENAS no Firestore (evita erro auth/network-request-failed)
      await updateUserProfileData({ avatar: newAvatarUrl });
      setAvatarUrl(newAvatarUrl);
      toast.success('Foto de perfil atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      toast.error('Erro ao atualizar foto de perfil');
    }
  };

  const [configuracoes, setConfiguracoes] = useState({
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesAula: true,
    notificacoesReuniao: true,
    notificacoesTarefa: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateUserProfileData({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
        departamentoFIAP: formData.departamentoFIAP,
        departamentoItau: formData.departamentoItau,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        bio: formData.bio,
        dataNascimento: formData.dataNascimento,
        avatar: avatarUrl,
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-[var(--theme-accent)]" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-foreground)]">Meu Perfil</h1>
          <p className="text-sm text-[var(--theme-muted-foreground)]">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
      </div>

      {/* Profile Photo Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-[var(--theme-accent)]">
            <AvatarImage src={avatarUrl} alt={formData.nome} />
            <AvatarFallback className="text-2xl">{getInitials(formData.nome || 'U')}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <p className="text-sm text-[var(--theme-muted-foreground)]">
              Clique para alterar sua foto de perfil
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAvatarDialogOpen(true)}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              Alterar Foto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> Nome Completo
                </Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input id="email" name="email" type="email" value={formData.email} disabled className="h-9 text-sm opacity-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefone
                </Label>
                <Input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleInputChange} placeholder="(11) 98765-4321" className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo" className="text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Cargo
                </Label>
                <Input id="cargo" name="cargo" value={formData.cargo} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento" className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Data de Nascimento
                </Label>
                <Input id="dataNascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamentoFIAP" className="text-sm">Departamento FIAP</Label>
                <Input id="departamentoFIAP" name="departamentoFIAP" value={formData.departamentoFIAP} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamentoItau" className="text-sm">Departamento Itaú</Label>
                <Input id="departamentoItau" name="departamentoItau" value={formData.departamentoItau} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="text-sm" rows={3} />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Endereço
                </Label>
                <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-sm">Cidade</Label>
                <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm">Estado</Label>
                <Input id="estado" name="estado" value={formData.estado} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep" className="text-sm">CEP</Label>
                <Input id="cep" name="cep" value={formData.cep} onChange={handleInputChange} className="h-9 text-sm" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'notificacoesEmail', label: 'Notificações por Email' },
            { key: 'notificacoesPush', label: 'Notificações Push' },
            { key: 'notificacoesAula', label: 'Notificações de Aula' },
            { key: 'notificacoesReuniao', label: 'Notificações de Reunião' },
            { key: 'notificacoesTarefa', label: 'Notificações de Tarefa' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <Label className="text-sm">{item.label}</Label>
              <Switch
                checked={(configuracoes as any)[item.key]}
                onCheckedChange={(checked) =>
                  setConfiguracoes(prev => ({ ...prev, [item.key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        open={isAvatarDialogOpen}
        onOpenChange={setIsAvatarDialogOpen}
        currentAvatar={avatarUrl}
        onAvatarChange={handleAvatarChange}
        fallback={getInitials(formData.nome || 'U')}
      />
    </div>
  );
}
