import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Calendar, Clock, FileText, Link as LinkIcon, Download, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { mockAulas } from '../../../lib/mock-data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const tipoIcons: Record<string, string> = {
  pdf: '📄',
  ppt: '📊',
  link: '🔗',
  video: '🎥',
  doc: '📝',
};

export function Aulas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAulas = mockAulas.filter(aula =>
    aula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aula.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Gestão de Aulas</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            {filteredAulas.length} aulas cadastradas
          </p>
        </div>
        <Button variant="theme" className="gap-2" onClick={() => navigate('/fiap/aulas/nova')}>
          <Plus className="w-4 h-4" />
          Nova Aula
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-muted-foreground)]" />
        <Input
          placeholder="Buscar por título ou disciplina..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Aulas List */}
      <div className="space-y-4">
        {filteredAulas.map(aula => (
          <Card key={aula.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{aula.titulo}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="theme">{aula.disciplina}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(aula.data, "d 'de' MMM, yyyy", { locale: ptBR })}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {aula.duracao} min
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--theme-muted-foreground)]">
                    {aula.descricao}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-[var(--theme-muted-foreground)]" />
                {aula.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Materiais */}
              <div>
                <h4 className="font-semibold mb-3 text-[var(--theme-foreground)]">
                  Materiais ({aula.materiais.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aula.materiais.map(material => (
                    <div
                      key={material.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--theme-background-secondary)] hover:bg-[var(--theme-hover)] transition-colors cursor-pointer group"
                    >
                      <div className="text-2xl">{tipoIcons[material.tipo]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[var(--theme-foreground)] truncate">
                          {material.nome}
                        </div>
                        <div className="text-xs text-[var(--theme-muted-foreground)]">
                          {material.tamanho || 'Link externo'}
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {material.tipo === 'link' ? (
                          <LinkIcon className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}