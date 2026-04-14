import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { FIAPIndex } from "./pages/fiap/index";
import { Aulas } from "./pages/fiap/aulas";
import { NovaAula } from "./pages/fiap/nova-aula";
import { Alunos } from "./pages/fiap/alunos";
import { NovoAluno } from "./pages/fiap/novo-aluno";
import { EditarAluno } from "./pages/fiap/editar-aluno";
import { NovaAvaliacao } from "./pages/fiap/nova-avaliacao";
import { Cronograma } from "./pages/fiap/cronograma";
import { KanbanFIAP } from "./pages/fiap/kanban";
import { NovaTarefaFIAP } from "./pages/fiap/nova-tarefa";
import { ItauIndex } from "./pages/itau/index";
import { Analistas } from "./pages/itau/analistas";
import { NovoAnalista } from "./pages/itau/novo-analista";
import { EditarAnalista } from "./pages/itau/editar-analista";
import { NovaAvaliacaoAnalista } from "./pages/itau/nova-avaliacao";
import { Feedbacks } from "./pages/itau/feedbacks";
import { Reunioes } from "./pages/itau/reunioes";
import { NovaReuniao } from "./pages/itau/nova-reuniao";
import { KanbanItau } from "./pages/itau/kanban";
import { NovaTarefaItau } from "./pages/itau/nova-tarefa";
import { AIAssistant } from "./pages/ai-assistant";
import { Perfil } from "./pages/perfil";
import { NotFound } from "./pages/not-found";
import { DetalheAnalista } from "./pages/itau/detalhe-analista";
import { DetalheAluno } from "./pages/fiap/detalhe-aluno";
import { UsuariosLote } from "./pages/admin/usuarios-lote";
import { EditarAula } from "./pages/fiap/editar-aula";
// Vida Pessoal
import { PessoalIndex } from "./pages/pessoal/index";
import { Viagens } from "./pages/pessoal/viagens";
import { NovaViagem } from "./pages/pessoal/nova-viagem";
import { EditarViagem } from "./pages/pessoal/editar-viagem";
import { DetalheViagem } from "./pages/pessoal/detalhe-viagem";
import { Custos } from "./pages/pessoal/custos";
import { NovoCusto } from "./pages/pessoal/novo-custo";
import { TarefasPessoais } from "./pages/pessoal/tarefas";
// WhatsApp
import { WhatsAppIntegracao } from "./pages/whatsapp";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "perfil", Component: Perfil },

      // FIAP
      { path: "fiap", Component: FIAPIndex },
      { path: "fiap/aulas", Component: Aulas },
      { path: "fiap/aulas/nova", Component: NovaAula },
      { path: "fiap/alunos", Component: Alunos },
      { path: "fiap/alunos/novo", Component: NovoAluno },
      { path: "fiap/alunos/editar/:id", Component: EditarAluno },
      { path: "fiap/alunos/:id/avaliacao", Component: NovaAvaliacao },
      { path: "fiap/cronograma", Component: Cronograma },
      { path: "fiap/kanban", Component: KanbanFIAP },
      { path: "fiap/kanban/nova", Component: NovaTarefaFIAP },
      { path: "fiap/alunos/:id", Component: DetalheAluno },
      { path: "fiap/aulas/editar/:disciplinaId/:aulaId", Component: EditarAula },

      // Itaú
      { path: "itau", Component: ItauIndex },
      { path: "itau/analistas", Component: Analistas },
      { path: "itau/analistas/novo", Component: NovoAnalista },
      { path: "itau/analistas/editar/:id", Component: EditarAnalista },
      { path: "itau/analistas/:id/avaliacao", Component: NovaAvaliacaoAnalista },
      { path: "itau/feedbacks", Component: Feedbacks },
      { path: "itau/reunioes", Component: Reunioes },
      { path: "itau/reunioes/nova", Component: NovaReuniao },
      { path: "itau/kanban", Component: KanbanItau },
      { path: "itau/kanban/nova", Component: NovaTarefaItau },
      { path: "itau/analistas/:id", Component: DetalheAnalista },

      // Vida Pessoal
      { path: "pessoal", Component: PessoalIndex },
      { path: "pessoal/viagens", Component: Viagens },
      { path: "pessoal/viagens/nova", Component: NovaViagem },
      { path: "pessoal/viagens/editar/:id", Component: EditarViagem },
      { path: "pessoal/viagens/:id", Component: DetalheViagem },
      { path: "pessoal/custos", Component: Custos },
      { path: "pessoal/custos/novo", Component: NovoCusto },
      { path: "pessoal/tarefas", Component: TarefasPessoais },

      // Shared
      { path: "ai", Component: AIAssistant },
      { path: "whatsapp", Component: WhatsAppIntegracao },

      // Admin
      { path: "admin/usuarios-lote", Component: UsuariosLote },

      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },

]);
