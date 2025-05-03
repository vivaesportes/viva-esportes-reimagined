
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { EventList } from "./EventList";

export const EventManagement = () => {
  const { events, loading, addEvent, deleteEvent } = useEventManagement();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('EventManagement mounted, events:', events);
  }, [events]);

  const handleSubmit = async (formData: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: File | null;
  }) => {
    setSubmitting(true);
    try {
      await addEvent(formData);
      setOpen(false);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Eventos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Evento</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo evento.
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <EventList 
        events={events}
        loading={loading}
        onDelete={deleteEvent}
      />
    </div>
  );
};
