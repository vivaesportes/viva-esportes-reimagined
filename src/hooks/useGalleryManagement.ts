
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_index: number;
}

export const useGalleryManagement = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
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

  const addItem = async (data: { title: string; description: string; image: File }) => {
    try {
      setLoading(true);
      const imageUrl = await uploadImage(data.image);
      
      if (!imageUrl) throw new Error('Falha ao fazer upload da imagem');

      const newItem = {
        title: data.title,
        description: data.description,
        image_url: imageUrl,
        order_index: items.length, // Add new items at the end
      };

      const { error } = await supabase
        .from('gallery_collections')
        .insert(newItem);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Item adicionado à galeria",
      });

      await loadItems();
    } catch (error: any) {
      console.error('Error adding gallery item:', error);
      toast({
        title: "Erro ao adicionar item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('gallery_collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Item removido da galeria",
      });

      setItems(items.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: "Erro ao remover item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      console.log('Loading gallery items...');
      
      const { data, error } = await supabase
        .from('gallery_collections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      console.log('Gallery items loaded:', data);
      setItems(data || []);
    } catch (error: any) {
      console.error('Error loading gallery items:', error);
      toast({
        title: "Erro ao carregar galeria",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load items when the hook is initialized
  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    deleteItem,
    loadItems,
  };
};
