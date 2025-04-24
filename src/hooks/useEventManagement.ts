
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string | null;
  image_url: string | null;
}

export const useEventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const addEvent = async (data: { 
    title: string; 
    date: string;
    time: string;
    location: string;
    description: string;
    image?: File;
  }) => {
    try {
      setLoading(true);
      let imageUrl = null;
      
      if (data.image) {
        imageUrl = await uploadImage(data.image);
      }

      const { error } = await supabase
        .from('events')
        .insert({
          ...data,
          image_url: imageUrl,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento adicionado",
      });

      await loadEvents();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar evento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento removido",
      });

      setEvents(events.filter(event => event.id !== id));
    } catch (error: any) {
      toast({
        title: "Erro ao remover evento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar eventos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    addEvent,
    deleteEvent,
    loadEvents,
  };
};
