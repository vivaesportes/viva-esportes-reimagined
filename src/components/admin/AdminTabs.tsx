
import { Users, BookOpen, Settings, Image, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from './UserManagement';
import { ClassManagement } from './ClassManagement';
import { SystemSettings } from './SystemSettings';
import { GalleryManagement } from './gallery/GalleryManagement';
import { EventManagement } from './events/EventManagement';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  horario: string;
  dia_semana: string;
  local: string;
  professor_id: string | null;
}

interface AdminTabsProps {
  usuarios: Usuario[];
  turmas: Turma[];
  loading: boolean;
  turmasLoading: boolean;
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  setTurmas: React.Dispatch<React.SetStateAction<Turma[]>>;
}

export const AdminTabs = ({ 
  usuarios, 
  turmas, 
  loading, 
  turmasLoading, 
  setUsuarios,
  setTurmas 
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="usuarios" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="usuarios" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Usuários
        </TabsTrigger>
        <TabsTrigger value="turmas" className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          Turmas
        </TabsTrigger>
        <TabsTrigger value="galeria" className="flex items-center">
          <Image className="mr-2 h-4 w-4" />
          Galeria
        </TabsTrigger>
        <TabsTrigger value="eventos" className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Eventos
        </TabsTrigger>
        <TabsTrigger value="config" className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="usuarios">
        <UserManagement 
          usuarios={usuarios} 
          loading={loading} 
          setUsuarios={setUsuarios}
        />
      </TabsContent>

      <TabsContent value="turmas">
        <ClassManagement
          turmas={turmas}
          usuarios={usuarios}
          turmasLoading={turmasLoading}
          setTurmas={setTurmas}
        />
      </TabsContent>

      <TabsContent value="galeria">
        <GalleryManagement />
      </TabsContent>

      <TabsContent value="eventos">
        <EventManagement />
      </TabsContent>

      <TabsContent value="config">
        <SystemSettings />
      </TabsContent>
    </Tabs>
  );
};
