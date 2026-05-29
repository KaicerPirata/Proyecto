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
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, X, Calendar as CalendarIcon, Trash2, ArrowLeft, Monitor, Zap, Laptop, ClipboardPlus, Eye, Replace, Download, Search, Filter, Pencil, Undo2 } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { assets as initialAssets, deletedAssets as initialDeletedAssets, users, companies, catalog } from '@/lib/mock-data';

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
  ram: z.string().min(1, 'La memoria RAM es requerida.'),
  ramType: z.string().optional(),
  storage: z.string().min(1, 'El disco duro es requerido.'),
  storageType: z.string().optional(),
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

type ComputerAssetSchema = z.infer<typeof computerAssetSchema>;
type SimpleAssetSchema = z.infer<typeof simpleAssetSchema>;

const addHistorySchema = z.object({
    author: z.string().min(1, 'El técnico es requerido.'),
    description: z.string().min(1, 'La descripción es requerida.'),
    type: z.enum(['Mantenimiento', 'Incidente'], {
        required_error: 'Debes seleccionar un tipo de registro.',
    }),
});

type AddHistorySchema = z.infer<typeof addHistorySchema>;

function AddHistoryForm({ assetId, onSaveSuccess }: { assetId: string, onSaveSuccess: () => void }) {
    const { toast } = useToast();
    const form = useForm<AddHistorySchema>({
        resolver: zodResolver(addHistorySchema),
        defaultValues: {
            author: '',
            description: '',
            type: 'Incidente',
        },
    });
    
    const technicians = users.filter(u => ['William Aguilera', 'Dylam Moralez', 'Carlos Fierro'].includes(u.name));

    function onSubmit(data: AddHistorySchema) {
        toast({
            title: 'Historial Añadido',
            description: 'El nuevo registro ha sido guardado correctamente.',
        });
        form.reset();
        onSaveSuccess();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Técnico Responsable</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un técnico" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {technicians.map(tech => (
                                    <SelectItem key={tech.id} value={tech.name}>{tech.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Tipo de Registro</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Mantenimiento" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Mantenimiento</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Incidente" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Incidente / Intervención</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción del Trabajo Realizado</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Detalla aquí el mantenimiento, instalación o incidente ocurrido con el equipo..."
                                    className="resize-y min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Guardar Registro</Button>
                </div>
            </form>
        </Form>
    );
}

function AssetForm({ assetType, onSaveSuccess, onBack, assetToEdit }: { assetType: 'Equipo de cómputo' | 'Monitor' | 'UPS', onSaveSuccess?: () => void, onBack?: () => void, assetToEdit?: any | null }) {
  const { toast } = useToast();
  const isEditMode = !!assetToEdit;
  const isComputer = assetType === 'Equipo de cómputo';
  const schema = isComputer ? computerAssetSchema : simpleAssetSchema;

  const defaultValues = isEditMode ? {
      ...assetToEdit,
      purchaseDate: new Date(assetToEdit.purchaseDate)
  } : (isComputer ? {
      responsable: '', serialNumber: '', invoiceNumber: '', assetName: '',
      networkName: '', brand: '', model: '', processor: '', processorGen: '', ram: '', ramType: '',
      storage: '', storageType: '', officeKey: '', osKey: '', equipmentType: 'portatil' as const,
      os: 'Windows 11 Pro' as const, officeVersion: 'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021' as const,
  } : {
      responsable: '', assetName: '', serialNumber: '', invoiceNumber: '',
      brand: '', model: '', description: '',
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  function onSubmit(data: z.infer<typeof schema>) {
      toast({
          title: isEditMode ? 'Actualización Exitosa' : 'Registro Exitoso',
          description: `El ${assetType.toLowerCase()} ha sido ${isEditMode ? 'actualizado' : 'registrado'} correctamente.`,
      });
      if (onSaveSuccess) onSaveSuccess();
  }

  return (
    <div className="relative pt-8">
        {(onBack || isEditMode) && !isEditMode && (
            <Button variant="ghost" onClick={onBack} className="absolute left-0 top-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
        )}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="responsable"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un responsable" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {users.map(user => (
                                <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <div className={`grid grid-cols-1 ${isComputer ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                <FormField
                control={form.control}
                name="assetName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Activo / Nombre</FormLabel>
                    <FormControl>
                        <Input placeholder={assetType} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Número de Serie</FormLabel>
                    <FormControl>
                        <Input placeholder="DXG-12345-ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Compra</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP') : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {(isComputer ? catalog.pcBrands : assetType === 'UPS' ? catalog.upsBrands : catalog.monitorBrands).map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {isComputer ? (
                <>
                <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Modelo" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.pcModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="processor"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Procesador</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="CPU" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.processors.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Memoria RAM</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="RAM" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.ramSizes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Almacenamiento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Disco" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.diskSizes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </>
                ) : (
                    <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Modelo" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {(assetType === 'UPS' ? catalog.upsModels : catalog.monitorModels).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
            </div>
            <Button type="submit" className="w-full">{isEditMode ? 'Guardar Cambios' : 'Registrar Activo'}</Button>
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
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createStep, setCreateStep] = useState(0);
    const [selectedType, setSelectedType] = useState<'Equipo de cómputo' | 'Monitor' | 'UPS'>('Equipo de cómputo');
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingHistory, setIsAddingHistory] = useState(false);

    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
        setUserName(localStorage.getItem('userName'));
    }, []);

    useEffect(() => {
        if (openAssetId) {
            const asset = assets.find(a => a.id === openAssetId);
            if (asset) {
                setSelectedAsset(asset);
                setIsDetailsOpen(true);
            }
        }
    }, [openAssetId, assets]);

    const filteredAssets = useMemo(() => {
        let list = userRole === 'estandar' ? assets.filter(a => a.responsable === userName) : assets;
        if (searchTerm) {
            list = list.filter(a => Object.values(a).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
        }
        return list;
    }, [assets, userRole, userName, searchTerm]);

    const handleViewDetails = (asset: any) => {
        setSelectedAsset(asset);
        setIsDetailsOpen(true);
        setIsEditing(false);
        setIsAddingHistory(false);
    };

    const handleDeleteAsset = (assetId: string) => {
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
            setAssets(assets.filter(a => a.id !== assetId));
            setDeletedAssets([...deletedAssets, { ...asset, deletionDate: format(new Date(), 'yyyy-MM-dd'), reason: 'Baja solicitada por técnico' }]);
            toast({ title: 'Activo Eliminado', description: 'El equipo se ha movido a la papelera.' });
        }
    };

    const handleRestoreAsset = (assetId: string) => {
        const asset = deletedAssets.find(a => a.id === assetId);
        if (asset) {
            setDeletedAssets(deletedAssets.filter(a => a.id !== assetId));
            setAssets([...assets, { ...asset, status: 'En Almacén' }]);
            toast({ title: 'Activo Restaurado', description: 'El equipo ha vuelto al inventario activo.' });
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full min-w-[800px]">
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-headline tracking-tight">Gestión de Activos</h1>
                            <p className="text-muted-foreground">Administra el inventario de hardware y su trazabilidad.</p>
                        </div>
                        {userRole !== 'estandar' && (
                            <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if(!open) setCreateStep(0); }}>
                                <DialogTrigger asChild>
                                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Activo</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Registrar Nuevo Activo</DialogTitle>
                                        <DialogDescription>Completa los datos técnicos del equipo.</DialogDescription>
                                    </DialogHeader>
                                    {createStep === 0 ? (
                                        <div className="grid grid-cols-3 gap-4 py-8">
                                            {[
                                                { type: 'Equipo de cómputo', icon: Laptop, label: 'Computador' },
                                                { type: 'Monitor', icon: Monitor, label: 'Monitor' },
                                                { type: 'UPS', icon: Zap, label: 'UPS / Energía' }
                                            ].map((item) => (
                                                <Button key={item.type} variant="outline" className="h-32 flex flex-col gap-3" onClick={() => { setSelectedType(item.type as any); setCreateStep(1); }}>
                                                    <item.icon className="h-8 w-8" />
                                                    <span>{item.label}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <AssetForm assetType={selectedType} onBack={() => setCreateStep(0)} onSaveSuccess={() => setIsCreateOpen(false)} />
                                    )}
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Inventario</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Buscar por serial, ID, nombre..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="active">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="active">Listado de Activos</TabsTrigger>
                                    {userRole !== 'estandar' && <TabsTrigger value="deleted">Activos Eliminados</TabsTrigger>}
                                </TabsList>
                                <TabsContent value="active">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID / Nombre</TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead>Responsable</TableHead>
                                                <TableHead>Serial</TableHead>
                                                <TableHead>Marca/Modelo</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAssets.map((asset) => (
                                                <TableRow key={asset.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{asset.id}</span>
                                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{asset.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{asset.category}</Badge>
                                                    </TableCell>
                                                    <TableCell>{asset.responsable}</TableCell>
                                                    <TableCell className="font-code text-xs">{asset.serialNumber}</TableCell>
                                                    <TableCell>{asset.brand} {asset.model}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(asset)}><Eye className="h-4 w-4" /></Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Ver Hoja de Vida</TooltipContent>
                                                                </Tooltip>
                                                                {userRole !== 'estandar' && (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Dar de baja este activo?</AlertDialogTitle>
                                                                                <AlertDialogDescription>El equipo se moverá a la lista de eliminados pero conservará su historial.</AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction onClick={() => handleDeleteAsset(asset.id)}>Confirmar</AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                )}
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="deleted">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID / Nombre</TableHead>
                                                <TableHead>Fecha Baja</TableHead>
                                                <TableHead>Motivo</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {deletedAssets.map((asset) => (
                                                <TableRow key={asset.id}>
                                                    <TableCell className="font-medium">{asset.id} - {asset.name}</TableCell>
                                                    <TableCell>{(asset as any).deletionDate}</TableCell>
                                                    <TableCell className="text-xs italic">{(asset as any).reason}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm" onClick={() => handleRestoreAsset(asset.id)}><Undo2 className="mr-2 h-4 w-4" /> Restaurar</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </main>

                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-2xl font-headline">Hoja de Vida: {selectedAsset?.id}</DialogTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> PDF</Button>
                                    {userRole !== 'estandar' && !isEditing && (
                                        <Button size="sm" onClick={() => setIsEditing(true)}><Pencil className="mr-2 h-4 w-4" /> Editar</Button>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>
                        
                        <div className="space-y-6 pt-4">
                            {isEditing ? (
                                <AssetForm 
                                    assetType={selectedAsset?.category} 
                                    assetToEdit={selectedAsset} 
                                    onBack={() => setIsEditing(false)} 
                                    onSaveSuccess={() => { setIsEditing(false); setIsDetailsOpen(false); }} 
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Especificaciones Técnicas</CardTitle></CardHeader>
                                            <CardContent className="grid grid-cols-2 gap-y-3 text-sm">
                                                <div className="text-muted-foreground">Responsable:</div><div className="font-medium">{selectedAsset?.responsable}</div>
                                                <div className="text-muted-foreground">Marca:</div><div>{selectedAsset?.brand}</div>
                                                <div className="text-muted-foreground">Modelo:</div><div>{selectedAsset?.model}</div>
                                                <div className="text-muted-foreground">Serial:</div><div className="font-code text-xs">{selectedAsset?.serialNumber}</div>
                                                {selectedAsset?.category === 'Equipo de cómputo' && (
                                                    <>
                                                        <div className="text-muted-foreground">Procesador:</div><div>{selectedAsset?.processor}</div>
                                                        <div className="text-muted-foreground">RAM:</div><div>{selectedAsset?.ram}</div>
                                                        <div className="text-muted-foreground">Disco:</div><div>{selectedAsset?.storage}</div>
                                                        <div className="text-muted-foreground">S.O:</div><div>{selectedAsset?.os}</div>
                                                    </>
                                                )}
                                                {selectedAsset?.description && (
                                                    <div className="col-span-2 pt-2 border-t mt-2">
                                                        <div className="text-muted-foreground mb-1">Descripción:</div>
                                                        <div className="italic text-xs">{selectedAsset.description}</div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                        {userRole !== 'estandar' && (
                                            <Button variant="outline" className="w-full" onClick={() => setIsAddingHistory(!isAddingHistory)}>
                                                {isAddingHistory ? 'Cerrar Formulario' : 'Añadir Registro al Historial'}
                                            </Button>
                                        )}
                                        {isAddingHistory && (
                                            <Card className="border-primary/50">
                                                <CardHeader><CardTitle className="text-sm">Nuevo Registro</CardTitle></CardHeader>
                                                <CardContent>
                                                    <AddHistoryForm assetId={selectedAsset?.id} onSaveSuccess={() => setIsAddingHistory(false)} />
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                    <div className="space-y-6">
                                        <AssetHistory assetId={selectedAsset?.id} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
