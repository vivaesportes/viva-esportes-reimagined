
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Clock, MapPin } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string | null;
  image_url: string | null;
}

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export const EventCard = ({ event, onDelete, loading }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return format(new Date(year, month - 1, day), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(event.date)}</span>
            <Clock className="h-4 w-4 ml-3 mr-1" />
            <span>{event.time}</span>
            <MapPin className="h-4 w-4 ml-3 mr-1" />
            <span>{event.location}</span>
          </div>
          <p className="text-sm mt-2">{event.description}</p>
        </div>
        <div className="flex items-start">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(event.id)}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {event.image_url && (
        <div className="mt-3">
          <img src={event.image_url} alt={event.title} className="h-24 object-contain rounded" />
        </div>
      )}
    </div>
  );
};
