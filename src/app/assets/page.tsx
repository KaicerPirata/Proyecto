
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
import { PlusCircle, Calendar as CalendarIcon, Trash2, ArrowLeft, Monitor, Zap, Laptop, Eye, Download, Search, Pencil, Undo2, Network } from 'lucide-react';
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
    
    const technicians = users.filter(u => ['William Aguilera', 'Dylam Moralez', 'Carlos Fierro', 'Whashintong Palma'].includes(u.name));

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
                        <Select onValueChange={field.onChange} value={field.value}>
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
        {onBack && !isEditMode && (
            <Button variant="ghost" onClick={onBack} className="absolute left-0 top-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
        )}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Responsable del Activo</FormLabel>
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
                <FormField
                control={form.control}
                name="assetName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre del Activo</FormLabel>
                    <FormControl>
                        <Input placeholder={`Ej: ${assetType} Gerencia`} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
                <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Número de Serie (S/N)</FormLabel>
                    <FormControl>
                        <Input placeholder="SN-123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nº Factura de Compra</FormLabel>
                    <FormControl>
                        <Input placeholder="FV-001" {...field} />
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
                    <FormLabel>Fecha de Adquisición</FormLabel>
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
            </div>

            <Separator />
            <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-primary">
                <Laptop className="h-4 w-4" /> Especificaciones de Hardware
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Seleccionar Marca" /></SelectTrigger>
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
                <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar Modelo" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {(isComputer ? catalog.pcModels : assetType === 'UPS' ? catalog.upsModels : catalog.monitorModels).map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {isComputer && (
                <>
                <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="micro">Micro</SelectItem>
                            <SelectItem value="portatil">Portátil</SelectItem>
                            <SelectItem value="servidor">Servidor</SelectItem>
                            <SelectItem value="sff">SFF (Small Form Factor)</SelectItem>
                            <SelectItem value="todo en uno">Todo en uno (AIO)</SelectItem>
                            <SelectItem value="torre">Torre</SelectItem>
                        </SelectContent>
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
                    <FormLabel>Procesador (CPU)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Modelo CPU" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.processors.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="processorGen"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Generación</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Generación" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.processorGenerations.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
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
                    <FormLabel>Capacidad RAM</FormLabel>
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
                name="ramType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tecnología RAM</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Tipo (DDR)" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.ramTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
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
                    <FormLabel>Capacidad Almacenamiento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Capacidad" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.diskSizes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="storageType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Disco</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Tecnología" /></SelectTrigger></FormControl>
                        <SelectContent>{catalog.diskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </>
                )}
            </div>

            {isComputer && (
                <>
                <Separator />
                <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-primary">
                    <Network className="h-4 w-4" /> Software y Red
                </div>
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="networkName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre en Red (Hostname)</FormLabel>
                                <FormControl><Input placeholder="Ej: PC-VENTAS-01" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/20">
                        <FormField
                            control={form.control}
                            name="os"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sistema Operativo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value as string}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="OS" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                                            <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                                            <SelectItem value="Linux">Linux</SelectItem>
                                            <SelectItem value="macOS">macOS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="osKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Clave de Producto SO</FormLabel>
                                    <FormControl><Input placeholder="XXXXX-XXXXX-XXXXX..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/20">
                        <FormField
                            control={form.control}
                            name="officeVersion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Versión de Microsoft Office</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value as string}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Office" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="NINGUNO">NINGUNO</SelectItem>
                                            <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2016">OFFICE 2016</SelectItem>
                                            <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2019">OFFICE 2019</SelectItem>
                                            <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">OFFICE 2021</SelectItem>
                                            <SelectItem value="OFFICE 365">OFFICE 365</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="officeKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Clave de Licencia Office</FormLabel>
                                    <FormControl><Input placeholder="YYYYY-YYYYY-YYYYY..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                </>
            )}

            {!isComputer && (
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Descripción / Observaciones Adicionales</FormLabel>
                    <FormControl><Textarea placeholder="Detalles técnicos, estado de batería, daños físicos, etc." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}

            <Button type="submit" className="w-full h-12 text-lg font-headline">
                {isEditMode ? 'Guardar Cambios' : 'Registrar en Inventario'}
            </Button>
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
                                    <Button size="lg"><PlusCircle className="mr-2 h-5 w-5" /> Nuevo Activo</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-headline">Registrar Nuevo Activo</DialogTitle>
                                        <DialogDescription>Selecciona la categoría y completa los datos técnicos.</DialogDescription>
                                    </DialogHeader>
                                    {createStep === 0 ? (
                                        <div className="grid grid-cols-3 gap-6 py-12">
                                            {[
                                                { type: 'Equipo de cómputo', icon: Laptop, label: 'Computador' },
                                                { type: 'Monitor', icon: Monitor, label: 'Monitor' },
                                                { type: 'UPS', icon: Zap, label: 'UPS / Energía' }
                                            ].map((item) => (
                                                <Button key={item.type} variant="outline" className="h-40 flex flex-col gap-4 hover:border-primary hover:bg-primary/5 transition-all" onClick={() => { setSelectedType(item.type as any); setCreateStep(1); }}>
                                                    <item.icon className="h-12 w-12 text-primary" />
                                                    <span className="font-headline text-lg">{item.label}</span>
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
                                <CardTitle className="font-headline">Inventario General</CardTitle>
                                <div className="relative w-80">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Buscar por serial, ID, marca..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="active" className="w-full">
                                <TabsList className="mb-6">
                                    <TabsTrigger value="active" className="px-8">Activos Operativos</TabsTrigger>
                                    {userRole !== 'estandar' && <TabsTrigger value="deleted" className="px-8">Papelera de Bajas</TabsTrigger>}
                                </TabsList>
                                <TabsContent value="active">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                <TableHead className="w-[120px]">ID Activo</TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead>Nombre / Descrip.</TableHead>
                                                <TableHead>Responsable</TableHead>
                                                <TableHead>Serial</TableHead>
                                                <TableHead>Marca/Modelo</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAssets.map((asset) => (
                                                <TableRow key={asset.id} className="group">
                                                    <TableCell className="font-bold text-primary">{asset.id}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-normal">{asset.category}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm font-medium">{asset.name}</span>
                                                    </TableCell>
                                                    <TableCell className="text-sm">{asset.responsable}</TableCell>
                                                    <TableCell className="font-code text-xs text-muted-foreground">{asset.serialNumber}</TableCell>
                                                    <TableCell className="text-sm">{asset.brand} {asset.model}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={() => handleViewDetails(asset)}><Eye className="h-4 w-4" /></Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Hoja de Vida</TooltipContent>
                                                                </Tooltip>
                                                                {userRole !== 'estandar' && (
                                                                    <AlertDialog>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <AlertDialogTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                                                                                </AlertDialogTrigger>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Dar de Baja</TooltipContent>
                                                                        </Tooltip>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle className="font-headline text-2xl">¿Dar de baja este activo?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    El equipo se moverá a la lista de eliminados. Conservará su historial pero dejará de contar en el inventario activo.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteAsset(asset.id)}>Confirmar Baja</AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                )}
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredAssets.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                        No se encontraron activos que coincidan con la búsqueda.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="deleted">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>ID / Nombre</TableHead>
                                                <TableHead>Fecha de Baja</TableHead>
                                                <TableHead>Motivo</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {deletedAssets.map((asset) => (
                                                <TableRow key={asset.id}>
                                                    <TableCell className="font-medium text-destructive">{asset.id} - {asset.name}</TableCell>
                                                    <TableCell>{(asset as any).deletionDate}</TableCell>
                                                    <TableCell className="text-sm italic text-muted-foreground">{(asset as any).reason}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary" onClick={() => handleRestoreAsset(asset.id)}><Undo2 className="mr-2 h-4 w-4" /> Restaurar</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {deletedAssets.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-italic">
                                                        No hay activos en la papelera.
                                                    </TableCell>
                                                </TableRow>
                                            )}
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
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <DialogTitle className="text-3xl font-headline text-primary">Hoja de Vida: {selectedAsset?.id}</DialogTitle>
                                    <DialogDescription className="text-base">Consulta técnica y trazabilidad del equipo.</DialogDescription>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" className="font-headline"><Download className="mr-2 h-4 w-4" /> Exportar Hoja de Vida (PDF)</Button>
                                    {userRole !== 'estandar' && !isEditing && (
                                        <Button size="sm" className="font-headline" onClick={() => setIsEditing(true)}><Pencil className="mr-2 h-4 w-4" /> Editar Especificaciones</Button>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>
                        
                        <div className="space-y-8 pt-6">
                            {isEditing ? (
                                <AssetForm 
                                    assetType={selectedAsset?.category} 
                                    assetToEdit={selectedAsset} 
                                    onBack={() => setIsEditing(false)} 
                                    onSaveSuccess={() => { setIsEditing(false); setIsDetailsOpen(false); }} 
                                />
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="shadow-none bg-muted/30">
                                                <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-primary">Información General</CardTitle></CardHeader>
                                                <CardContent className="grid grid-cols-1 gap-y-3 text-sm">
                                                    <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Responsable:</span><span className="font-bold">{selectedAsset?.responsable}</span></div>
                                                    <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Marca:</span><span>{selectedAsset?.brand}</span></div>
                                                    <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Modelo:</span><span>{selectedAsset?.model}</span></div>
                                                    <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Serial S/N:</span><span className="font-code text-xs">{selectedAsset?.serialNumber}</span></div>
                                                    <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Factura:</span><span>{selectedAsset?.invoiceNumber || 'N/A'}</span></div>
                                                    <div className="flex justify-between py-1"><span className="text-muted-foreground">Fecha Compra:</span><span>{selectedAsset?.purchaseDate}</span></div>
                                                </CardContent>
                                            </Card>

                                            {selectedAsset?.category === 'Equipo de cómputo' && (
                                                <Card className="shadow-none bg-muted/30">
                                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-primary">Hardware & Red</CardTitle></CardHeader>
                                                    <CardContent className="grid grid-cols-1 gap-y-3 text-sm">
                                                        <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Hostname:</span><span className="font-bold">{selectedAsset?.networkName || 'N/A'}</span></div>
                                                        <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Procesador:</span><span>{selectedAsset?.processor} {selectedAsset?.processorGen}</span></div>
                                                        <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">RAM:</span><span>{selectedAsset?.ram} {selectedAsset?.ramType}</span></div>
                                                        <div className="flex justify-between border-b py-1"><span className="text-muted-foreground">Disco:</span><span>{selectedAsset?.storage} {selectedAsset?.storageType}</span></div>
                                                        <div className="flex justify-between py-1"><span className="text-muted-foreground">Tipo Equipo:</span><span className="capitalize">{selectedAsset?.equipmentType || 'N/A'}</span></div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>

                                        {selectedAsset?.category === 'Equipo de cómputo' && (
                                            <Card className="shadow-none bg-muted/30">
                                                <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-primary">Software y Licenciamiento</CardTitle></CardHeader>
                                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground mb-1">Sistema Operativo:</p>
                                                        <p className="font-medium">{selectedAsset?.os}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">Key: <span className="font-code">{selectedAsset?.osKey || 'N/A'}</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground mb-1">Microsoft Office:</p>
                                                        <p className="font-medium">{selectedAsset?.officeVersion}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">Key: <span className="font-code">{selectedAsset?.officeKey || 'N/A'}</span></p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {selectedAsset?.description && (
                                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-xs font-bold text-yellow-800 uppercase mb-2">Observaciones / Notas Técnicas:</p>
                                                <p className="text-sm text-yellow-900 italic">{selectedAsset.description}</p>
                                            </div>
                                        )}

                                        {userRole !== 'estandar' && (
                                            <div className="space-y-4">
                                                <Button variant={isAddingHistory ? "secondary" : "default"} className="w-full h-12 font-headline" onClick={() => setIsAddingHistory(!isAddingHistory)}>
                                                    {isAddingHistory ? 'Cancelar Registro' : 'Añadir Nueva Intervención Técnica'}
                                                </Button>
                                                {isAddingHistory && (
                                                    <Card className="border-primary">
                                                        <CardHeader><CardTitle className="text-lg font-headline">Nuevo Registro de Historial</CardTitle></CardHeader>
                                                        <CardContent>
                                                            <AddHistoryForm assetId={selectedAsset?.id} onSaveSuccess={() => setIsAddingHistory(false)} />
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:col-span-1">
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
