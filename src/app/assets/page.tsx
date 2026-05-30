
'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Calendar as CalendarIcon, Trash2, ArrowLeft, Monitor, Zap, Laptop, Eye, Download, Search, Pencil, Undo2, Network, Cpu, HardDrive, Plus, X } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AssetHistory from '@/components/dashboard/asset-history';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { assets as initialAssets, deletedAssets as initialDeletedAssets, users, catalog } from '@/lib/mock-data';

const computerAssetSchema = z.object({
  responsable: z.string().min(1, 'El responsable es requerido.'),
  serialNumber: z.string().min(1, 'El número de serie es requerido.'),
  invoiceNumber: z.string().optional(),
  purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
  assetName: z.string().min(1, 'El nombre del activo es requerido.'),
  networkName: z.string().optional(),
  equipmentType: z.enum(['micro', 'portatil', 'servidor', 'sff', 'todo en uno', 'torre']),
  brand: z.string().min(1, 'La marca es requerida.'),
  model: z.string().min(1, 'El modelo es requerido.'),
  processor: z.string().min(1, 'El procesador es requerido.'),
  processorGen: z.string().optional(),
  rams: z.array(z.object({
    size: z.string().min(1, 'Requerido'),
    type: z.string().min(1, 'Requerido'),
  })).min(1, 'Al menos un módulo RAM es requerido'),
  storages: z.array(z.object({
    size: z.string().min(1, 'Requerido'),
    type: z.string().min(1, 'Requerido'),
  })).min(1, 'Al menos un disco es requerido'),
  os: z.enum(['Windows 10 Pro', 'Windows 11 Pro', 'Linux', 'macOS']),
  osKey: z.string().optional(),
  officeVersion: z.enum([
    'NINGUNO',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2007',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2010',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2013',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2016',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2019',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES',
    'OFFICE 365'
  ]),
  officeKey: z.string().optional(),
});

const simpleAssetSchema = z.object({
    assetName: z.string().min(1, 'El nombre del activo es requerido.'),
    responsable: z.string().min(1, 'El responsable es requerido.'),
    serialNumber: z.string().min(1, 'El número de serie es requerido.'),
    invoiceNumber: z.string().optional(),
    purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
    brand: z.string().min(1, 'La marca es requerida.'),
    model: z.string().min(1, 'El modelo es requerido.'),
    description: z.string().optional(),
});

function AddHistoryForm({ assetId, onSaveSuccess }: { assetId: string, onSaveSuccess: () => void }) {
    const { toast } = useToast();
    const form = useForm({
        defaultValues: { author: '', description: '', type: 'Incidente' as const },
    });
    
    const technicians = users.filter(u => u.department === 'Tecnología');

    function onSubmit(data: any) {
        toast({ title: 'Historial Añadido', description: 'El registro ha sido guardado.' });
        onSaveSuccess();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="author" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Técnico Responsable</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un técnico" /></SelectTrigger></FormControl>
                            <SelectContent>{technicians.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Tipo de Registro</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Mantenimiento" /><Label>Mantenimiento</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Incidente" /><Label>Incidente</Label></div>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descripción del Trabajo</FormLabel>
                        <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                    </FormItem>
                )} />
                <Button type="submit" className="w-full">Guardar Registro</Button>
            </form>
        </Form>
    );
}

function AssetForm({ assetType, onSaveSuccess, onBack, assetToEdit }: { assetType: string, onSaveSuccess?: () => void, onBack?: () => void, assetToEdit?: any }) {
  const { toast } = useToast();
  const isEditMode = !!assetToEdit;
  const isComputer = assetType === 'Equipo de cómputo';
  const schema = isComputer ? computerAssetSchema : simpleAssetSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEditMode ? { ...assetToEdit, purchaseDate: new Date(assetToEdit.purchaseDate) } : (isComputer ? {
      responsable: '', serialNumber: '', invoiceNumber: '', assetName: '', networkName: '', brand: '', model: '', processor: '', processorGen: '',
      rams: [{ size: '', type: '' }], storages: [{ size: '', type: '' }], officeKey: '', osKey: '', equipmentType: 'portatil', os: 'Windows 11 Pro', officeVersion: 'OFFICE 365',
    } : { responsable: '', assetName: '', serialNumber: '', invoiceNumber: '', brand: '', model: '', description: '' })
  });

  const { fields: ramFields, append: appendRam, remove: removeRam } = useFieldArray({ control: form.control, name: "rams" as any });
  const { fields: storageFields, append: appendStorage, remove: removeStorage } = useFieldArray({ control: form.control, name: "storages" as any });
  const firstRamType = form.watch("rams.0.type" as any);

  function onSubmit(data: any) {
      toast({ title: isEditMode ? 'Actualizado' : 'Registrado', description: 'Operación exitosa.' });
      if (onSaveSuccess) onSaveSuccess();
  }

  return (
    <div className="relative pt-8">
        {onBack && !isEditMode && <Button variant="ghost" onClick={onBack} className="absolute left-0 top-0"><ArrowLeft className="mr-2 h-4 w-4" /> Volver</Button>}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="responsable" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                            <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="assetName" render={({ field }) => (
                    <FormItem><FormLabel>Nombre del Activo</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="serialNumber" render={({ field }) => (
                    <FormItem><FormLabel>S/N Serial</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                    <FormItem><FormLabel>Factura</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha Compra</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value as Date, 'PPP') : <span>Seleccionar</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value as Date} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                    </FormItem>
                )} />
            </div>

            <Separator />
            <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-primary"><Laptop className="h-4 w-4" /> Hardware</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                            <SelectContent>{(isComputer ? catalog.pcBrands : assetType === 'UPS' ? catalog.upsBrands : catalog.monitorBrands).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                        </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                            <SelectContent>{(isComputer ? catalog.pcModels : assetType === 'UPS' ? catalog.upsModels : catalog.monitorModels).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>

            {isComputer && (
                <div className="space-y-8">
                    {/* Procesador Group */}
                    <div className="border p-6 rounded-xl bg-muted/20 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase"><Cpu className="h-4 w-4" /> Procesador</div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField control={form.control} name="processor" render={({ field }) => (
                                <FormItem><FormLabel>Modelo de CPU</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value as string}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>{catalog.processors.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                </Select></FormItem>
                            )} />
                            <FormField control={form.control} name="processorGen" render={({ field }) => (
                                <FormItem><FormLabel>Generación</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value as string}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>{catalog.processorGenerations.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                </Select></FormItem>
                            )} />
                        </div>
                    </div>

                    {/* RAM Multi-Module Section */}
                    <div className="border p-6 rounded-xl bg-muted/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase"><Cpu className="h-4 w-4" /> Memoria RAM</div>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendRam({ size: '', type: firstRamType || '' })}><Plus className="h-4 w-4 mr-2" /> Añadir Módulo</Button>
                        </div>
                        {ramFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 gap-4 border-b pb-4 last:border-0 last:pb-0 relative">
                                <FormField control={form.control} name={`rams.${index}.size` as any} render={({ field }) => (
                                    <FormItem><FormLabel>Capacidad RAM ({index + 1})</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>{catalog.ramSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select></FormItem>
                                )} />
                                <FormField control={form.control} name={`rams.${index}.type` as any} render={({ field }) => (
                                    <FormItem><FormLabel>Tecnología ({index + 1})</FormLabel>
                                    <Select onValueChange={(val) => { field.onChange(val); if(index === 0) ramFields.forEach((_, i) => i > 0 && form.setValue(`rams.${i}.type` as any, val)); }} value={index === 0 ? field.value : firstRamType} disabled={index > 0}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>{catalog.ramTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select></FormItem>
                                )} />
                                {ramFields.length > 1 && <Button variant="ghost" size="icon" className="absolute right-0 top-8 text-destructive" onClick={() => removeRam(index)}><Trash2 className="h-4 w-4" /></Button>}
                            </div>
                        ))}
                    </div>

                    {/* Storage Section */}
                    <div className="border p-6 rounded-xl bg-muted/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase"><HardDrive className="h-4 w-4" /> Almacenamiento</div>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendStorage({ size: '', type: '' })}><Plus className="h-4 w-4 mr-2" /> Añadir Disco</Button>
                        </div>
                        {storageFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 gap-4 border-b pb-4 last:border-0 last:pb-0 relative">
                                <FormField control={form.control} name={`storages.${index}.size` as any} render={({ field }) => (
                                    <FormItem><FormLabel>Capacidad Disco ({index + 1})</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>{catalog.diskSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select></FormItem>
                                )} />
                                <FormField control={form.control} name={`storages.${index}.type` as any} render={({ field }) => (
                                    <FormItem><FormLabel>Tipo Disco ({index + 1})</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>{catalog.diskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select></FormItem>
                                )} />
                                {storageFields.length > 1 && <Button variant="ghost" size="icon" className="absolute right-0 top-8 text-destructive" onClick={() => removeStorage(index)}><Trash2 className="h-4 w-4" /></Button>}
                            </div>
                        ))}
                    </div>

                    <Separator />
                    <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-primary"><Network className="h-4 w-4" /> Software & Red</div>
                    
                    <FormField control={form.control} name="networkName" render={({ field }) => (
                        <FormItem><FormLabel>Nombre en Red (Hostname)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />

                    {/* OS Group */}
                    <div className="border p-6 rounded-xl bg-muted/20 space-y-4">
                        <FormField control={form.control} name="os" render={({ field }) => (
                            <FormItem><FormLabel>Sistema Operativo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value as string}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem><SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem></SelectContent>
                            </Select></FormItem>
                        )} />
                        <FormField control={form.control} name="osKey" render={({ field }) => (
                            <FormItem><FormLabel>Clave de Producto SO</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                    </div>

                    {/* Office Group */}
                    <div className="border p-6 rounded-xl bg-muted/20 space-y-4">
                        <FormField control={form.control} name="officeVersion" render={({ field }) => (
                            <FormItem><FormLabel>Versión Office</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value as string}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="OFFICE 365">OFFICE 365</SelectItem><SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">OFFICE 2021</SelectItem></SelectContent>
                            </Select></FormItem>
                        )} />
                        <FormField control={form.control} name="officeKey" render={({ field }) => (
                            <FormItem><FormLabel>Clave de Licencia Office</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>
            )}

            {!isComputer && <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Observaciones</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />}

            <Button type="submit" className="w-full h-14 text-lg font-bold">{isEditMode ? 'Guardar Cambios' : 'Registrar en Inventario'}</Button>
        </form>
        </Form>
    </div>
  );
}

export default function AssetsPage() {
    const searchParams = useSearchParams();
    const openAssetId = searchParams.get('openAssetId');
    const { toast } = useToast();
    const [assets, setAssets] = useState(initialAssets);
    const [deletedAssets, setDeletedAssets] = useState(initialDeletedAssets);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createStep, setCreateStep] = useState(0);
    const [selectedType, setSelectedType] = useState('Equipo de cómputo');
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingHistory, setIsAddingHistory] = useState(false);

    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
        setUserName(localStorage.getItem('userName'));
    }, []);

    useEffect(() => {
        if (openAssetId) {
            const asset = assets.find(a => a.id === openAssetId);
            if (asset) { setSelectedAsset(asset); setIsDetailsOpen(true); }
        }
    }, [openAssetId, assets]);

    const filteredAssets = useMemo(() => {
        let list = userRole === 'estandar' ? assets.filter(a => a.responsable === userName) : assets;
        if (searchTerm) list = list.filter(a => Object.values(a).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
        return list;
    }, [assets, userRole, userName, searchTerm]);

    const handleDeleteAsset = (id: string) => {
        const asset = assets.find(a => a.id === id);
        if (asset) {
            setAssets(assets.filter(a => a.id !== id));
            setDeletedAssets([...deletedAssets, { ...asset, deletionDate: format(new Date(), 'yyyy-MM-dd'), reason: 'Baja' }] as any);
            toast({ title: 'Eliminado', description: 'Movido a papelera.' });
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full min-w-[800px]">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div><h1 className="text-3xl font-bold font-headline">Activos</h1><p className="text-muted-foreground">Inventario tecnológico centralizado.</p></div>
                        {userRole !== 'estandar' && (
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild><Button size="lg"><PlusCircle className="mr-2 h-5 w-5" /> Nuevo Activo</Button></DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader><DialogTitle className="text-2xl font-headline">Registrar</DialogTitle></DialogHeader>
                                    {createStep === 0 ? (
                                        <div className="grid grid-cols-3 gap-6 py-12">
                                            {[ { type: 'Equipo de cómputo', icon: Laptop, label: 'PC' }, { type: 'Monitor', icon: Monitor, label: 'Monitor' }, { type: 'UPS', icon: Zap, label: 'UPS' } ].map(i => (
                                                <Button key={i.type} variant="outline" className="h-40 flex flex-col gap-4" onClick={() => { setSelectedType(i.type); setCreateStep(1); }}><i.icon className="h-12 w-12" />{i.label}</Button>
                                            ))}
                                        </div>
                                    ) : <AssetForm assetType={selectedType} onBack={() => setCreateStep(0)} onSaveSuccess={() => { setIsCreateOpen(false); setCreateStep(0); }} />}
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Inventario</CardTitle>
                            <Input placeholder="Buscar..." className="w-80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="active">
                                <TabsList className="mb-4"><TabsTrigger value="active">Operativos</TabsTrigger><TabsTrigger value="deleted">Papelera</TabsTrigger></TabsList>
                                <TabsContent value="active">
                                    <Table>
                                        <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nombre</TableHead><TableHead>Serial</TableHead><TableHead>Responsable</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {filteredAssets.map(a => (
                                                <TableRow key={a.id}><TableCell className="font-bold text-primary">{a.id}</TableCell><TableCell>{a.name}</TableCell><TableCell>{a.serialNumber}</TableCell><TableCell>{a.responsable}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => { setSelectedAsset(a); setIsDetailsOpen(true); }}><Eye className="h-4 w-4" /></Button>{userRole !== 'estandar' && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAsset(a.id)}><Trash2 className="h-4 w-4" /></Button>}</TableCell></TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </main>

                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex justify-between items-center border-b pb-4">
                                <DialogTitle className="text-2xl font-headline">Hoja de Vida: {selectedAsset?.id}</DialogTitle>
                                {userRole !== 'estandar' && !isEditing && <Button onClick={() => setIsEditing(true)}><Pencil className="h-4 w-4 mr-2" /> Editar</Button>}
                            </div>
                        </DialogHeader>
                        <div className="pt-6">
                            {isEditing ? <AssetForm assetType={selectedAsset?.category} assetToEdit={selectedAsset} onBack={() => setIsEditing(false)} onSaveSuccess={() => setIsDetailsOpen(false)} /> : (
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="bg-muted/30 p-4"><h3 className="text-xs font-bold text-primary uppercase mb-2">General</h3><div className="text-sm space-y-1"><p>Responsable: <b>{selectedAsset?.responsable}</b></p><p>Serial: <b>{selectedAsset?.serialNumber}</b></p><p>Compra: <b>{selectedAsset?.purchaseDate}</b></p></div></Card>
                                            {selectedAsset?.category === 'Equipo de cómputo' && (
                                                <Card className="bg-muted/30 p-4"><h3 className="text-xs font-bold text-primary uppercase mb-2">Especificaciones</h3><div className="text-sm space-y-2"><p>CPU: <b>{selectedAsset?.processor}</b></p><div>RAM: {selectedAsset?.rams?.map((r:any, i:number) => <Badge key={i} className="mr-1">{r.size}</Badge>)}</div><div>Disco: {selectedAsset?.storages?.map((s:any, i:number) => <Badge key={i} variant="outline" className="mr-1">{s.size}</Badge>)}</div></div></Card>
                                            )}
                                        </div>
                                        {userRole !== 'estandar' && (
                                            <div className="space-y-4">
                                                <Button className="w-full" onClick={() => setIsAddingHistory(!isAddingHistory)}>{isAddingHistory ? 'Cancelar' : 'Añadir Intervención'}</Button>
                                                {isAddingHistory && <AddHistoryForm assetId={selectedAsset?.id} onSaveSuccess={() => setIsAddingHistory(false)} />}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-1"><AssetHistory assetId={selectedAsset?.id} /></div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
