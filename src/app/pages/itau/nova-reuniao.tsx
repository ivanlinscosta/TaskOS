import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

export function NovaReuniao() {
  const navigate = useNavigate();
  const location = useLocation();
  const aiData = location.state as any;

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'alinhamento',
    data: '',
    horario: '',
    duracao: '',
    local: '',
    linkOnline: '',
    descricao: '',
    pauta: [''],
    participantes: [''],
  });

  // Pré-preencher com dados da IA se disponíveis
  useEffect(() => {
    if (aiData) {
      setFormData(prev => ({
        ...prev,
        titulo: aiData.titulo || prev.titulo,
        data: aiData.data || prev.data,
        horario: aiData.horario || prev.horario,
        duracao: aiData.duracao || prev.duracao,
        descricao: aiData.descricao || prev.descricao,
        participantes: aiData.participantes ? [aiData.participantes] : prev.participantes,
      }));
    }
  }, [aiData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar a reunião
    console.log('Nova reunião:', formData);
    navigate('/itau/reunioes');
  };

  const addPauta = () => {
    setFormData({ ...formData, pauta: [...formData.pauta, ''] });
  };

  const removePauta = (index: number) => {
    const newPauta = formData.pauta.filter((_, i) => i !== index);
    setFormData({ ...formData, pauta: newPauta });
  };

  const updatePauta = (index: number, value: string) => {
    const newPauta = [...formData.pauta];
    newPauta[index] = value;
    setFormData({ ...formData, pauta: newPauta });
  };

  const addParticipante = () => {
    setFormData({ ...formData, participantes: [...formData.participantes, ''] });
  };

  const removeParticipante = (index: number) => {
    const newParticipantes = formData.participantes.filter((_, i) => i !== index);
    setFormData({ ...formData, participantes: newParticipantes });
  };

  const updateParticipante = (index: number, value: string) => {
    const newParticipantes = [...formData.participantes];
    newParticipantes[index] = value;
    setFormData({ ...formData, participantes: newParticipantes });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/itau/reunioes')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Nova Reunião</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Agende uma nova reunião
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Título e Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Reunião *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Sprint Planning Q1 2026"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Reunião *</Label>
                <select
                  id="tipo"
                  className="w-full px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                >
                  <option value="alinhamento">Alinhamento</option>
                  <option value="planning">Planning</option>
                  <option value="retrospectiva">Retrospectiva</option>
                  <option value="review">Review</option>
                  <option value="1on1">1-on-1</option>
                  <option value="workshop">Workshop</option>
                  <option value="apresentacao">Apresentação</option>
                </select>
              </div>
            </div>

            {/* Data, Horário e Duração */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario">Horário *</Label>
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (min) *</Label>
                <Input
                  id="duracao"
                  type="number"
                  placeholder="Ex: 60"
                  value={formData.duracao}
                  onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  required
                  min="15"
                  step="15"
                />
              </div>
            </div>

            {/* Local e Link Online */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  placeholder="Ex: Sala de Reuniões 3 - 15º andar"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkOnline">Link Online (Teams/Meet/Zoom)</Label>
                <Input
                  id="linkOnline"
                  type="url"
                  placeholder="https://teams.microsoft.com/..."
                  value={formData.linkOnline}
                  onChange={(e) => setFormData({ ...formData, linkOnline: e.target.value })}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Breve descrição do objetivo da reunião..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pauta */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pauta da Reunião</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addPauta} className="gap-2">
                <Plus className="w-3 h-3" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.pauta.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Item ${index + 1} da pauta`}
                  value={item}
                  onChange={(e) => updatePauta(index, e.target.value)}
                />
                {formData.pauta.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePauta(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Participantes */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Participantes</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addParticipante} className="gap-2">
                <Plus className="w-3 h-3" />
                Adicionar Participante
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.participantes.map((participante, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nome ou e-mail do participante"
                  value={participante}
                  onChange={(e) => updateParticipante(index, e.target.value)}
                />
                {formData.participantes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipante(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/itau/reunioes')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="theme">
            Agendar Reunião
          </Button>
        </div>
      </form>
    </div>
  );
}