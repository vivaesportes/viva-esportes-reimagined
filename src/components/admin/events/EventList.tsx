
import { Loader2 } from "lucide-react";
import { EventCard } from "./EventCard";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string | null;
  image_url: string | null;
}

interface EventListProps {
  events: Event[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export const EventList = ({ events, loading, onDelete }: EventListProps) => {
  if (loading && !events.length) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum evento cadastrado. Adicione um evento clicando no botão acima.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onDelete={onDelete} 
          loading={loading} 
        />
      ))}
    </div>
  );
};
