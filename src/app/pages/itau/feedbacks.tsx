import { Plus, ThumbsUp, ThumbsDown, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { mockFeedbacks, mockAnalistas } from '../../../lib/mock-data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Feedbacks() {
  const getFeedbackAnalista = (analistaId: string) => {
    return mockAnalistas.find(a => a.id === analistaId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Gestão de Feedbacks</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            {mockFeedbacks.length} feedbacks registrados
          </p>
        </div>
        <Button variant="theme" className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Feedback
        </Button>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {mockFeedbacks.map(feedback => {
          const analista = getFeedbackAnalista(feedback.analistaId);
          if (!analista) return null;

          return (
            <Card key={feedback.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-[var(--theme-accent)]">
                      <AvatarImage src={analista.foto} />
                      <AvatarFallback>
                        {analista.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{analista.nome}</CardTitle>
                      <p className="text-sm text-[var(--theme-muted-foreground)]">
                        {analista.funcao}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="theme" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(feedback.data, "d 'de' MMM", { locale: ptBR })}
                    </Badge>
                    <p className="text-xs text-[var(--theme-muted-foreground)] mt-1">
                      Próxima: {format(feedback.proximaRevisao, "d 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pontos Fortes */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    Pontos Fortes
                  </h4>
                  <ul className="space-y-1.5">
                    {feedback.pontosFortes.map((ponto, index) => (
                      <li 
                        key={index}
                        className="text-sm text-[var(--theme-foreground)] p-2 rounded-lg bg-green-500/10 border border-green-500/20"
                      >
                        • {ponto}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pontos de Melhoria */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
                    <ThumbsDown className="w-4 h-4" />
                    Pontos de Melhoria
                  </h4>
                  <ul className="space-y-1.5">
                    {feedback.pontosMelhoria.map((ponto, index) => (
                      <li 
                        key={index}
                        className="text-sm text-[var(--theme-foreground)] p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
                      >
                        • {ponto}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Combinados */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-600">
                    <Target className="w-4 h-4" />
                    Combinados
                  </h4>
                  <ul className="space-y-1.5">
                    {feedback.combinados.map((combinado, index) => (
                      <li 
                        key={index}
                        className="text-sm text-[var(--theme-foreground)] p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
                      >
                        • {combinado}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
