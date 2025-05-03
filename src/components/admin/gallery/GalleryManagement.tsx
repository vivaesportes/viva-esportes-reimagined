
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGalleryManagement } from "@/hooks/useGalleryManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { GalleryForm } from "./GalleryForm";
import { GalleryGrid } from "./GalleryGrid";

export const GalleryManagement = () => {
  const { items, loading, addItem, deleteItem } = useGalleryManagement();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    image: File;
  }) => {
    setSubmitting(true);
    try {
      await addItem(formData);
      setOpen(false);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    // This function is called when the dialog is closed
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Galeria</h2>
        <Dialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Foto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Foto</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar uma nova foto à galeria.
              </DialogDescription>
            </DialogHeader>
            <GalleryForm 
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <GalleryGrid 
        items={items}
        loading={loading}
        onDelete={deleteItem}
      />
    </div>
  );
};
