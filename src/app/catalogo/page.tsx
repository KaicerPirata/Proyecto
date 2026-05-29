
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Settings2, Laptop, Cpu, HardDrive, Zap, Monitor as MonitorIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { catalog as initialCatalog } from '@/lib/mock-data';

type CatalogKey = keyof typeof initialCatalog;

export default function CatalogoPage() {
  const { toast } = useToast();
  const [catalog, setCatalog] = useState(initialCatalog);
  const [newItem, setNewItem] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  const addItem = (key: CatalogKey) => {
    if (!newItem.trim()) return;
    if (catalog[key].includes(newItem.trim())) {
      toast({ variant: 'destructive', title: 'Error', description: 'Este elemento ya existe.' });
      return;
    }

    setCatalog((prev) => ({
      ...prev,
      [key]: [...prev[key], newItem.trim()],
    }));
    setNewItem('');
    toast({ title: 'Añadido', description: 'Elemento añadido al catálogo.' });
  };

  const removeItem = (key: CatalogKey, item: string) => {
    setCatalog((prev) => ({
      ...prev,
      [key]: prev[key].filter((i) => i !== item),
    }));
    toast({ title: 'Eliminado', description: 'Elemento removido del catálogo.' });
  };

  const CatalogSection = ({ title, description, items, catalogKey, icon: Icon }: { title: string, description: string, items: string[], catalogKey: CatalogKey, icon: any }) => (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir a {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Ingresar nuevo valor..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem(catalogKey)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => addItem(catalogKey)}>Guardar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre / Valor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item}>
                <TableCell className="font-medium">{item}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(catalogKey, item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  No hay elementos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <Settings2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight">Catálogo Técnico</h1>
              <p className="text-muted-foreground">Gestiona las opciones disponibles para el registro de activos.</p>
            </div>
          </div>

          <Tabs defaultValue="pc" className="space-y-6">
            <TabsList className="bg-muted p-1 rounded-lg">
              <TabsTrigger value="pc" className="flex gap-2">
                <Laptop className="h-4 w-4" /> PC & Modelos
              </TabsTrigger>
              <TabsTrigger value="ram" className="flex gap-2">
                <Cpu className="h-4 w-4" /> RAM
              </TabsTrigger>
              <TabsTrigger value="disco" className="flex gap-2">
                <HardDrive className="h-4 w-4" /> Almacenamiento
              </TabsTrigger>
              <TabsTrigger value="procesador" className="flex gap-2">
                <Cpu className="h-4 w-4" /> Procesadores
              </TabsTrigger>
              <TabsTrigger value="ups-mon" className="flex gap-2">
                <Zap className="h-4 w-4" /> UPS & Monitores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pc" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CatalogSection
                  title="Modelos de PC"
                  description="Modelos específicos de laptops y desktops."
                  items={catalog.pcModels}
                  catalogKey="pcModels"
                  icon={Laptop}
                />
                <CatalogSection
                  title="Marcas de PC"
                  description="Fabricantes de computadoras."
                  items={catalog.pcBrands}
                  catalogKey="pcBrands"
                  icon={Laptop}
                />
              </div>
            </TabsContent>

            <TabsContent value="ram" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CatalogSection
                  title="Capacidades RAM"
                  description="Tamaños de memoria disponibles."
                  items={catalog.ramSizes}
                  catalogKey="ramSizes"
                  icon={Cpu}
                />
                <CatalogSection
                  title="Tipos de RAM"
                  description="Tecnologías (DDR1, DDR2, etc.)"
                  items={catalog.ramTypes}
                  catalogKey="ramTypes"
                  icon={Cpu}
                />
              </div>
            </TabsContent>

            <TabsContent value="disco" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CatalogSection
                  title="Capacidades de Disco"
                  description="Espacio de almacenamiento disponible."
                  items={catalog.diskSizes}
                  catalogKey="diskSizes"
                  icon={HardDrive}
                />
                <CatalogSection
                  title="Tipos de Disco"
                  description="Tecnologías (SSD, M.2, HDD)"
                  items={catalog.diskTypes}
                  catalogKey="diskTypes"
                  icon={HardDrive}
                />
              </div>
            </TabsContent>

            <TabsContent value="procesador" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CatalogSection
                  title="Procesadores"
                  description="Modelos de CPU (Intel, AMD)"
                  items={catalog.processors}
                  catalogKey="processors"
                  icon={Cpu}
                />
                <CatalogSection
                  title="Generaciones"
                  description="Generaciones de los procesadores."
                  items={catalog.processorGenerations}
                  catalogKey="processorGenerations"
                  icon={Cpu}
                />
              </div>
            </TabsContent>

            <TabsContent value="ups-mon" className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <CatalogSection
                  title="Marcas de UPS"
                  description="Proveedores de respaldo de energía."
                  items={catalog.upsBrands}
                  catalogKey="upsBrands"
                  icon={Zap}
                />
                <CatalogSection
                  title="Modelos de UPS"
                  description="Modelos específicos de equipos UPS."
                  items={catalog.upsModels}
                  catalogKey="upsModels"
                  icon={Zap}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CatalogSection
                  title="Marcas de Monitor"
                  description="Fabricantes de pantallas."
                  items={catalog.monitorBrands}
                  catalogKey="monitorBrands"
                  icon={MonitorIcon}
                />
                <CatalogSection
                  title="Modelos de Monitor"
                  description="Modelos específicos de monitores."
                  items={catalog.monitorModels}
                  catalogKey="monitorModels"
                  icon={MonitorIcon}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
