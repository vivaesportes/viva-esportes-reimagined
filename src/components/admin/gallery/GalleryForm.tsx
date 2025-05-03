
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface GalleryFormProps {
  onSubmit: (data: { title: string; description: string; image: File }) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

export const GalleryForm = ({ onSubmit, onCancel, submitting }: GalleryFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      return;
    }
    
    try {
      await onSubmit(formData as { title: string; description: string; image: File });
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Imagem</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="h-32 object-contain" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || !formData.image}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>Adicionar</>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
