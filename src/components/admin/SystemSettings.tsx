
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Settings } from 'lucide-react';

export const SystemSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Configurações gerais para a plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-lg">Backup do Sistema</h3>
              <p className="text-gray-500 text-sm">Faça o download de um backup completo dos dados</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Baixar Backup
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-lg">Manutenção do Sistema</h3>
              <p className="text-gray-500 text-sm">Ative o modo de manutenção para bloquear o acesso ao site</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              Ativar Manutenção
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-lg">Notificações</h3>
              <p className="text-gray-500 text-sm">Configure as notificações por e-mail do sistema</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
