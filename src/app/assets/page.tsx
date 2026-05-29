
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
        try {
            console.log('New history entry for asset', assetId, data);
            toast({
                title: 'Historial Añadido',
                description: 'El nuevo registro ha sido guardado correctamente.',
            });
            form.reset();
            onSaveSuccess();
        } catch (error) {
            console.error('Error adding history:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo guardar el registro. Inténtalo de nuevo.',
            });
        }
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

  const defaultComputerValues = {
      responsable: '', serialNumber: '', invoiceNumber: '', assetName: '',
      networkName: '', brand: '', model: '', processor: '', processorGen: '', ram: '', ramType: '',
      storage: '', storageType: '', officeKey: '', osKey: '', equipmentType: 'portatil' as const,
      os: 'Windows 11 Pro' as const, officeVersion: 'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021' as const,
  };

  const defaultSimpleValues = {
      responsable: '', assetName: '', serialNumber: '', invoiceNumber: '',
      brand: '', model: '', description: '',
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isComputer ? defaultComputerValues : defaultSimpleValues,
  });

  useEffect(() => {
    if (isEditMode && assetToEdit) {
      const valuesToSet: any = {
        ...assetToEdit,
        purchaseDate: new Date(assetToEdit.purchaseDate),
      };
      form.reset(valuesToSet);
    }
  }, [isEditMode, assetToEdit, form, isComputer]);

  function onSubmit(data: z.infer<typeof schema>) {
    try {
      if (isEditMode) {
        console.log('Asset data updated:', { assetType, ...data });
        toast({
          title: 'Actualización Exitosa',
          description: `El ${assetType.toLowerCase()} ha sido actualizado correctamente.`,
        });
      } else {
        console.log('Asset data submitted:', { assetType, ...data });
        toast({
          title: 'Registro Exitoso',
          description: `El ${assetType.toLowerCase()} ha sido registrado correctamente.`,
        });
        form.reset();
      }
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error during operation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo ${isEditMode ? 'actualizar' : 'registrar'} el activo. Inténtalo de nuevo.`,
      });
    }
  }

  const getPlaceholder = () => {
    switch (assetType) {
        case 'Equipo de cómputo':
            return 'LAPTOP-001';
        case 'Monitor':
            return 'MONITOR-001';
        case 'UPS':
            return 'UPS-001';
    }
  }

  return (
    <>
        {(onBack || isEditMode) && (
            <Button variant="ghost" onClick={onBack} className="absolute left-4 top-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
        )}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6 pt-10">
            <div className="mb-6">
                 <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value as string} disabled={isEditMode}>
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
            </div>
            
            <Separator className="my-4" />

            <div className={`grid grid-cols-1 ${isComputer ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                {/* Common Fields */}
                <FormField
                control={form.control}
                name="assetName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Activo / Nombre</FormLabel>
                    <FormControl>
                        <Input placeholder={getPlaceholder()} {...field} />
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
                name="invoiceNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Factura (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="FV-2024-9876" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                    <FormLabel>Fecha de Compra</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value as Date | undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                            }
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
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona Marca" />
                            </SelectTrigger>
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
                
                {/* Computer-specific fields */}
                {isComputer && (
                <>
                <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona Modelo" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {catalog.pcModels.map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="networkName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre en Red (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="PC-VENTAS-01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="micro">Micro</SelectItem>
                        <SelectItem value="portatil">Portátil</SelectItem>
                        <SelectItem value="servidor">Servidor</SelectItem>
                        <SelectItem value="sff">SFF</SelectItem>
                        <SelectItem value="todo en uno">Todo en Uno</SelectItem>
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
                    <FormLabel>Procesador</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona CPU" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {catalog.processors.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
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
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona Gen" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {catalog.processorGenerations.map(g => (
                                <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="grid grid-cols-2 gap-2">
                    <FormField
                    control={form.control}
                    name="ram"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>RAM</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Capac" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {catalog.ramSizes.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
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
                        <FormLabel>Tipo RAM</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {catalog.ramTypes.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <FormField
                    control={form.control}
                    name="storage"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Capacidad Disco</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Capac" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {catalog.diskSizes.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
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
                        <FormLabel>Tipo Disco</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {catalog.diskTypes.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="md:col-span-3" />
                <FormField
                control={form.control}
                name="officeVersion"
                render={({ field }) => (
                    <FormItem className="md:col-span-1">
                    <FormLabel>Versión de Office</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una versión" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="NINGUNO">Ninguno</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2007">Office 2007</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2010">Office 2010</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2013">Office 2013</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2016">Office 2016</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2019">Office 2019</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">Office 2021</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES">Office 2024</SelectItem>
                        <SelectItem value="OFFICE 365">Office 365</SelectItem>
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
                    <FormItem className="md:col-span-2">
                    <FormLabel>Clave de Office (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                    <FormItem className="md:col-span-1">
                    <FormLabel>Sistema Operativo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un S.O." />
                        </SelectTrigger>
                        </FormControl>
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
                    <FormItem className="md:col-span-2">
                    <FormLabel>Clave de S.O. (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </>
                )}

                {/* Simple form specific fields (Monitor / UPS) */}
                {!isComputer && (
                    <>
                    <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona Modelo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {(assetType === 'UPS' ? catalog.upsModels : catalog.monitorModels).map(m => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Descripción (Opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Cualquier detalle adicional sobre el activo..."
                                    className="resize-none"
                                    {...(field as any)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </>
                )}


                <div className={`${isComputer ? "md:col-span-3" : "md:col-span-2"} pt-4`}>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    {isEditMode ? 'Guardar Cambios' : 'Registrar Activo'}
                </Button>
                </div>
            </div>
        </form>
        </Form>
    </>
  );
}
