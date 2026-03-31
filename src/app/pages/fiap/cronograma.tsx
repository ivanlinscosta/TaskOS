import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockAulas } from '../../../lib/mock-data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '../../../lib/cn';

export function Cronograma() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAulasForDay = (day: Date) => {
    return mockAulas.filter(aula => isSameDay(aula.data, day));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)] flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-[var(--theme-accent)]" />
            Cronograma
          </h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Calendário de aulas e eventos
          </p>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center font-semibold text-sm text-[var(--theme-muted-foreground)] p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map(day => {
              const aulas = getAulasForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[100px] p-2 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-hover)] transition-colors",
                    isCurrentDay && "bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-2",
                    isCurrentDay ? "text-[var(--theme-accent)]" : "text-[var(--theme-foreground)]"
                  )}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {aulas.map(aula => (
                      <div
                        key={aula.id}
                        className="text-xs p-1.5 rounded bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)] truncate"
                        title={aula.titulo}
                      >
                        {format(aula.data, 'HH:mm')} - {aula.titulo}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAulas.map(aula => (
              <div 
                key={aula.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--theme-background-secondary)]"
              >
                <div className="flex-1">
                  <div className="font-semibold text-[var(--theme-foreground)]">{aula.titulo}</div>
                  <div className="text-sm text-[var(--theme-muted-foreground)]">
                    {aula.disciplina}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="theme">
                    {format(aula.data, "d 'de' MMM", { locale: ptBR })}
                  </Badge>
                  <div className="text-xs text-[var(--theme-muted-foreground)] mt-1">
                    {format(aula.data, 'HH:mm')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
