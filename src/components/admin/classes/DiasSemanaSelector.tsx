
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface DiasSemana {
  id: string;
  label: string;
  checked: boolean;
}

interface DiasSemanaSelectorProps {
  diasSemana: DiasSemana[];
  onDiaChange: (id: string, checked: boolean) => void;
}

export const DiasSemanaSelector = ({ diasSemana, onDiaChange }: DiasSemanaSelectorProps) => {
  return (
    <div className="grid gap-2">
      <Label className="font-medium">Dias da Semana</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {diasSemana.map((dia) => (
          <div key={dia.id} className="flex items-center space-x-2">
            <Checkbox 
              id={dia.id}
              checked={dia.checked}
              onCheckedChange={(checked) => onDiaChange(dia.id, checked as boolean)}
            />
            <Label htmlFor={dia.id} className="text-sm font-normal cursor-pointer">
              {dia.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
