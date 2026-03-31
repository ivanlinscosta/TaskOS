import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';

export function NovaAula() {
  const navigate = useNavigate();
  const location = useLocation();
  const aiData = location.state as any;

  const [formData, setFormData] = useState({
    titulo: '',
    disciplina: '',
    data: '',
    duracao: '',
    descricao: '',
    objetivos: [''],
    topicos: [''],
    materiais: [{ tipo: 'pdf', nome: '', url: '' }],
  });

  // Pré-preencher com dados da IA se disponíveis
  useEffect(() => {
    if (aiData) {
      setFormData(prev => ({
        ...prev,
        titulo: aiData.titulo || prev.titulo,
        descricao: aiData.descricao || prev.descricao,
        duracao: aiData.duracao || prev.duracao,
        materiais: aiData.materiais ? [{ tipo: 'pdf', nome: aiData.materiais, url: '' }] : prev.materiais,
      }));
    }
  }, [aiData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar a aula
    console.log('Nova aula:', formData);
    navigate('/fiap/aulas');
  };

  const addObjetivo = () => {
    setFormData({ ...formData, objetivos: [...formData.objetivos, ''] });
  };

  const removeObjetivo = (index: number) => {
    const newObjetivos = formData.objetivos.filter((_, i) => i !== index);
    setFormData({ ...formData, objetivos: newObjetivos });
  };

  const updateObjetivo = (index: number, value: string) => {
    const newObjetivos = [...formData.objetivos];
    newObjetivos[index] = value;
    setFormData({ ...formData, objetivos: newObjetivos });
  };

  const addTopico = () => {
    setFormData({ ...formData, topicos: [...formData.topicos, ''] });
  };

  const removeTopico = (index: number) => {
    const newTopicos = formData.topicos.filter((_, i) => i !== index);
    setFormData({ ...formData, topicos: newTopicos });
  };

  const updateTopico = (index: number, value: string) => {
    const newTopicos = [...formData.topicos];
    newTopicos[index] = value;
    setFormData({ ...formData, topicos: newTopicos });
  };

  const addMaterial = () => {
    setFormData({ 
      ...formData, 
      materiais: [...formData.materiais, { tipo: 'pdf', nome: '', url: '' }] 
    });
  };

  const removeMaterial = (index: number) => {
    const newMateriais = formData.materiais.filter((_, i) => i !== index);
    setFormData({ ...formData, materiais: newMateriais });
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    const newMateriais = [...formData.materiais];
    newMateriais[index] = { ...newMateriais[index], [field]: value };
    setFormData({ ...formData, materiais: newMateriais });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/fiap/aulas')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Nova Aula</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Cadastre uma nova aula no sistema
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Título e Disciplina */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Aula *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Introdução ao React"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disciplina">Disciplina *</Label>
                <Input
                  id="disciplina"
                  placeholder="Ex: Frontend Development"
                  value={formData.disciplina}
                  onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Data e Duração */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="duracao">Duração (minutos) *</Label>
                <Input
                  id="duracao"
                  type="number"
                  placeholder="Ex: 90"
                  value={formData.duracao}
                  onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o conteúdo da aula..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
                rows={4}
              />
            </div>

            {/* Objetivos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Objetivos de Aprendizagem</Label>
                <Button type="button" variant="outline" size="sm" onClick={addObjetivo} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Adicionar
                </Button>
              </div>
              {formData.objetivos.map((objetivo, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Objetivo ${index + 1}`}
                    value={objetivo}
                    onChange={(e) => updateObjetivo(index, e.target.value)}
                  />
                  {formData.objetivos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeObjetivo(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Tópicos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tópicos Abordados</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTopico} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Adicionar
                </Button>
              </div>
              {formData.topicos.map((topico, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Tópico ${index + 1}`}
                    value={topico}
                    onChange={(e) => updateTopico(index, e.target.value)}
                  />
                  {formData.topicos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTopico(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Materiais */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Materiais de Apoio</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMaterial} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Adicionar
                </Button>
              </div>
              {formData.materiais.map((material, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <select
                        className="px-3 py-2 rounded-md border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
                        value={material.tipo}
                        onChange={(e) => updateMaterial(index, 'tipo', e.target.value)}
                      >
                        <option value="pdf">PDF</option>
                        <option value="ppt">PowerPoint</option>
                        <option value="doc">Documento</option>
                        <option value="link">Link</option>
                        <option value="video">Vídeo</option>
                      </select>
                      {formData.materiais.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Nome do material"
                      value={material.nome}
                      onChange={(e) => updateMaterial(index, 'nome', e.target.value)}
                    />
                    <Input
                      placeholder="URL do material"
                      value={material.url}
                      onChange={(e) => updateMaterial(index, 'url', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/fiap/aulas')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="theme">
            Cadastrar Aula
          </Button>
        </div>
      </form>
    </div>
  );
}