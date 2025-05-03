
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface GalleryItemProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
  };
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export const GalleryItem = ({ item, onDelete, loading }: GalleryItemProps) => {
  return (
    <div className="relative group">
      <img
        src={item.image_url}
        alt={item.title}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <h3 className="mt-2 font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
  );
};
