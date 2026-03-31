import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockAnalistas } from '../../../lib/mock-data';

export function NovaAvaliacaoAnalista() {
  const navigate = useNavigate();
  const { id } = useParams();
  const analista = mockAnalistas.find(a => a.id === id);

  const [formData, setFormData] = useState({
    tipo: '',
    nota: '',
    data: new Date().toISOString().split('T')[0],
    comentario: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você integraria com Firebase/backend
    console.log('Nova avaliação:', { analistaId: id, ...formData });
    navigate('/itau/analistas');
  };

  return (
    <div className="p-4 space-y-4">
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
            Nova Avaliação de Desempenho
          </h1>
          <p className="text-xs text-[var(--theme-muted-foreground)]">
            {analista ? `Registrar avaliação para ${analista.nome}` : 'Carregando...'}
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
                    <SelectItem value="mensal">Avaliação Mensal</SelectItem>
                    <SelectItem value="trimestral">Avaliação Trimestral</SelectItem>
                    <SelectItem value="semestral">Avaliação Semestral</SelectItem>
                    <SelectItem value="anual">Avaliação Anual</SelectItem>
                    <SelectItem value="projeto">Avaliação de Projeto</SelectItem>
                    <SelectItem value="promocao">Avaliação de Promoção</SelectItem>
                    <SelectItem value="feedback">Feedback Pontual</SelectItem>
                    <SelectItem value="pdi">PDI - Plano de Desenvolvimento</SelectItem>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="data" className="text-sm">Data da Avaliação *</Label>
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
                <Label htmlFor="comentario" className="text-sm">Comentários e Observações *</Label>
                <Textarea
                  id="comentario"
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  placeholder="Descreva o desempenho do analista, pontos fortes, áreas de melhoria e objetivos para o próximo período"
                  rows={6}
                  required
                  className="text-sm"
                />
              </div>

              {/* Campos adicionais de competências */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold">Competências Avaliadas (Opcional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                  <div className="space-y-1">
                    <Label htmlFor="tecnica" className="text-xs">Competência Técnica</Label>
                    <Input
                      id="tecnica"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="0-10"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lideranca" className="text-xs">Liderança</Label>
                    <Input
                      id="lideranca"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="0-10"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="comunicacao" className="text-xs">Comunicação</Label>
                    <Input
                      id="comunicacao"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="0-10"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="trabalhoEquipe" className="text-xs">Trabalho em Equipe</Label>
                    <Input
                      id="trabalhoEquipe"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="0-10"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="produtividade" className="text-xs">Produtividade</Label>
                    <Input
                      id="produtividade"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="0-10"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="inovacao" className="text-xs">Inovação</Label>
                    <Input
                      id="inovacao"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="0-10"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
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
