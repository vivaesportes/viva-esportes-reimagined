
import { GalleryItem } from "./GalleryItem";
import { Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_index: number;
}

interface GalleryGridProps {
  items: GalleryItem[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export const GalleryGrid = ({ items, loading, onDelete }: GalleryGridProps) => {
  if (loading && !items.length) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma foto na galeria. Adicione uma foto clicando no botão acima.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <GalleryItem 
          key={item.id} 
          item={item} 
          onDelete={onDelete}
          loading={loading} 
        />
      ))}
    </div>
  );
};
