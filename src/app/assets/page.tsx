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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  PlusCircle,
  Calendar as CalendarIcon,
  Trash2,
  ArrowLeft,
  Monitor,
  Zap,
  Laptop,
  Eye,
  Download,
  Search,
  Pencil,
  Network,
  Cpu,
  HardDrive,
  Plus,
  ShieldCheck,
  FileText,
  Info,
  X,
  History,
  RefreshCcw,
  Archive,
  Filter,
} from 'lucide-react';
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
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AssetHistory from '@/components/dashboard/asset-history';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { assets as initialAssets, deletedAssets as initialDeletedAssets, users, catalog, companies } from '@/lib/mock-data';

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
    'OFFICE 365',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2019',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2016',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2013'
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

function AddHistoryForm({ assetId, onSaveSuccess, onCancel }: { assetId: string; onSaveSuccess: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { author: '', description: '', type: 'Incidente' as const },
  });

  const technicians = users.filter((u) => u.department === 'Tecnología');

  function onSubmit(data: any) {
    toast({ title: 'Registro Exitoso', description: 'El historial ha sido actualizado.' });
    onSaveSuccess();
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider">Nuevo Registro de Historial</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {technicians.map((t) => (
                        <SelectItem key={t.id} value={t.name}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mantenimiento" id="r1" />
                        <Label htmlFor="r1">Mantenimiento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Incidente" id="r2" />
                        <Label htmlFor="r2">Incidente</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Trabajo</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" placeholder="Detalla el mantenimiento o incidente..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Guardar Registro</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function AssetForm({
  assetType,
  onSaveSuccess,
  onBack,
  assetToEdit,
}: {
  assetType: string;
  onSaveSuccess?: () => void;
  onBack?: () => void;
  assetToEdit?: any;
}) {
  const { toast } = useToast();
  const isEditMode = !!assetToEdit;
  const isComputer = assetType === 'Equipo de cómputo' || assetToEdit?.category === 'Equipo de cómputo';
  const schema = isComputer ? computerAssetSchema : simpleAssetSchema;

  const defaultValues = useMemo(() => {
    if (isEditMode) {
      return { 
        ...assetToEdit, 
        purchaseDate: assetToEdit.purchaseDate ? new Date(assetToEdit.purchaseDate) : new Date() 
      };
    }
    if (isComputer) {
      return {
        responsable: '',
        serialNumber: '',
        invoiceNumber: '',
        assetName: '',
        networkName: '',
        brand: '',
        model: '',
        processor: '',
        processorGen: '',
        rams: [{ size: '', type: '' }],
        storages: [{ size: '', type: '' }],
        officeKey: '',
        osKey: '',
        equipmentType: 'portatil',
        os: 'Windows 11 Pro',
        officeVersion: 'OFFICE 365',
      };
    }
    return { responsable: '', assetName: '', serialNumber: '', invoiceNumber: '', brand: '', model: '', description: '' };
  }, [isEditMode, isComputer, assetToEdit]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields: ramFields, append: appendRam, remove: removeRam } = useFieldArray({
    control: form.control,
    name: 'rams',
  });
  
  const { fields: storageFields, append: appendStorage, remove: removeStorage } = useFieldArray({
    control: form.control,
    name: 'storages',
  });

  const firstRamType = form.watch('rams.0.type');

  function onSubmit(data: any) {
    toast({ title: isEditMode ? 'Actualizado' : 'Registrado', description: 'Operación exitosa.' });
    if (onSaveSuccess) onSaveSuccess();
  }

  return (
    <div className="relative pt-8">
      {onBack && !isEditMode && (
        <Button variant="ghost" onClick={onBack} className="absolute left-0 top-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable del Activo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value as string}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.name}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre o Etiqueta</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: LAP-TECH-01" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm font-semibold uppercase tracking-wider text-primary border-b pb-2">
            <div className="flex items-center">
               <FileText className="h-4 w-4 inline mr-2" /> Información de Compra
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>S/N Serial</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nro Factura</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                      <Button
                        variant="outline"
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value as Date, 'PPP') : <span>Seleccionar fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value as Date} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <Separator />
          
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-primary">
            <Laptop className="h-4 w-4" /> Especificaciones de Hardware
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value as string}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(isComputer ? catalog.pcBrands : assetType === 'UPS' ? catalog.upsBrands : catalog.monitorBrands).map(
                        (b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
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
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(isComputer ? catalog.pcModels : assetType === 'UPS' ? catalog.upsModels : catalog.monitorModels).map(
                        (m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {isComputer && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="processor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procesador</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar CPU" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {catalog.processors.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="processorGen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Generación del Procesador</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar generación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {catalog.processorGenerations.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4" /> Configuración de RAM
                  </h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendRam({ size: '', type: firstRamType || '' })}>
                    <Plus className="h-3 w-3 mr-2" /> Añadir Módulo
                  </Button>
                </div>
                {ramFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 gap-4 p-4 border rounded-xl bg-muted/20 relative">
                    <FormField
                      control={form.control}
                      name={`rams.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacidad Módulo {index + 1}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Ej: 8 GB" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {catalog.ramSizes.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`rams.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de RAM {index + 1}</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              if (index === 0) {
                                ramFields.forEach((_, i) => i > 0 && form.setValue(`rams.${i}.type`, val));
                              }
                            }}
                            value={index === 0 ? field.value : firstRamType}
                            disabled={index > 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Ej: DDR4" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {catalog.ramTypes.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    {ramFields.length > 1 && (
                      <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRam(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <HardDrive className="h-4 w-4" /> Almacenamiento
                  </h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendStorage({ size: '', type: '' })}>
                    <Plus className="h-3 w-3 mr-2" /> Añadir Unidad
                  </Button>
                </div>
                {storageFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 gap-4 p-4 border rounded-xl bg-muted/20 relative">
                    <FormField
                      control={form.control}
                      name={`storages.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacidad Disco {index + 1}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Ej: 512 GB" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {catalog.diskSizes.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`storages.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Disco {index + 1}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Ej: M.2 NVMe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {catalog.diskTypes.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    {storageFields.length > 1 && (
                      <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeStorage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Separator />
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-primary">
                <Network className="h-4 w-4" /> Software & Red
              </div>

              <FormField
                control={form.control}
                name="networkName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostname (Nombre en Red)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="os"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sistema Operativo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar SO" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                            <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                            <SelectItem value="Linux">Linux</SelectItem>
                            <SelectItem value="macOS">macOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="osKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Key (Windows)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XXXXX-XXXXX-..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="officeVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versión Microsoft Office</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar versión" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NINGUNO">NINGUNO</SelectItem>
                            <SelectItem value="OFFICE 365">OFFICE 365</SelectItem>
                            <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">OFFICE 2021</SelectItem>
                            <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2019">OFFICE 2019</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="officeKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Key (Office)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="YYYYY-YYYYY-..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full py-6 text-lg font-bold">
            {isEditMode ? 'Actualizar Información' : 'Registrar en Inventario'}
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
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [selectedType, setSelectedType] = useState('Equipo de cómputo');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingHistory, setIsAddingHistory] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState({
    responsable: 'all',
    company: 'all',
    category: 'all',
    status: 'all',
  });

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  useEffect(() => {
    if (openAssetId) {
      const asset = assets.find((a) => a.id === openAssetId);
      if (asset) {
        setSelectedAsset(asset);
        setIsDetailsOpen(true);
      }
    }
  }, [openAssetId, assets]);

  const filteredAssets = useMemo(() => {
    let list = userRole === 'estandar' ? assets.filter((a) => a.responsable === userName) : assets;
    
    // Apply search term
    if (searchTerm) {
      list = list.filter((a) => Object.values(a).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
    }

    // Apply advanced filters (handling 'all' as no filter)
    if (advancedFilters.responsable !== 'all') list = list.filter(a => a.responsable === advancedFilters.responsable);
    if (advancedFilters.company !== 'all') list = list.filter(a => a.company === advancedFilters.company);
    if (advancedFilters.category !== 'all') list = list.filter(a => a.category === advancedFilters.category);
    if (advancedFilters.status !== 'all') list = list.filter(a => a.status === advancedFilters.status);

    return list;
  }, [assets, userRole, userName, searchTerm, advancedFilters]);

  const filteredDeletedAssets = useMemo(() => {
    let list = deletedAssets;
    if (searchTerm) {
      list = list.filter((a) => Object.values(a).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
    }
    return list;
  }, [deletedAssets, searchTerm]);

  const handleDeleteAsset = (id: string) => {
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      setAssets(assets.filter((a) => a.id !== id));
      setDeletedAssets([...deletedAssets, { ...asset, deletionDate: format(new Date(), 'yyyy-MM-dd'), reason: 'Baja' }] as any);
      toast({ title: 'Activo Dado de Baja', description: 'El equipo se ha movido a la papelera.' });
    }
  };

  const handleRestoreAsset = (id: string) => {
    const asset = deletedAssets.find((a) => a.id === id);
    if (asset) {
      setDeletedAssets(deletedAssets.filter((a) => a.id !== id));
      const { deletionDate, reason, ...rest } = asset as any;
      setAssets([...assets, rest]);
      toast({ title: 'Activo Restaurado', description: 'El equipo ha vuelto al listado principal.' });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-headline text-primary">Gestión de Activos</h1>
              <p className="text-muted-foreground">Administración del inventario técnico y ciclo de vida.</p>
            </div>
            {userRole !== 'estandar' && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="shadow-md">
                    <PlusCircle className="mr-2 h-5 w-5" /> Nuevo Registro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Registrar Nuevo Activo</DialogTitle>
                  </DialogHeader>
                  {createStep === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
                      {[
                        { type: 'Equipo de cómputo', icon: Laptop, label: 'Computador' },
                        { type: 'Monitor', icon: Monitor, label: 'Monitor' },
                        { type: 'UPS', icon: Zap, label: 'UPS' },
                      ].map((i) => (
                        <Button
                          key={i.type}
                          variant="outline"
                          className="h-40 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                          onClick={() => {
                            setSelectedType(i.type);
                            setCreateStep(1);
                          }}
                        >
                          <i.icon className="h-12 w-12" />
                          <span className="font-bold">{i.label}</span>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <AssetForm
                      assetType={selectedType}
                      onBack={() => setCreateStep(0)}
                      onSaveSuccess={() => {
                        setIsCreateOpen(false);
                        setCreateStep(0);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Tabs defaultValue="list" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted p-1 rounded-lg">
                <TabsTrigger value="list" className="flex gap-2">
                  <Archive className="h-4 w-4" /> Listado Maestro
                </TabsTrigger>
                <TabsTrigger value="deleted" className="flex gap-2">
                  <Trash2 className="h-4 w-4" /> Activos Eliminados
                </TabsTrigger>
              </TabsList>
              <div className="relative w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por serial, nombre..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-search" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                          <Filter className="h-4 w-4" /> Búsqueda Avanzada
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Responsable</Label>
                            <Select value={advancedFilters.responsable} onValueChange={(v) => setAdvancedFilters(f => ({ ...f, responsable: v }))}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Todos" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Empresa</Label>
                            <Select value={advancedFilters.company} onValueChange={(v) => setAdvancedFilters(f => ({ ...f, company: v }))}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Todas" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {companies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Categoría</Label>
                            <Select value={advancedFilters.category} onValueChange={(v) => setAdvancedFilters(f => ({ ...f, category: v }))}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Todas" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="Equipo de cómputo">Computador</SelectItem>
                                <SelectItem value="Monitor">Monitor</SelectItem>
                                <SelectItem value="UPS">UPS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Estado</Label>
                            <Select value={advancedFilters.status} onValueChange={(v) => setAdvancedFilters(f => ({ ...f, status: v }))}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Todos" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Asignado">Asignado</SelectItem>
                                <SelectItem value="En Almacén">En Almacén</SelectItem>
                                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                           <Button variant="ghost" size="sm" onClick={() => setAdvancedFilters({ responsable: 'all', company: 'all', category: 'all', status: 'all' })}>
                             Limpiar Filtros
                           </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Serial</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssets.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-bold text-primary">{a.id}</TableCell>
                          <TableCell>{a.name}</TableCell>
                          <TableCell className="font-code text-xs">{a.serialNumber}</TableCell>
                          <TableCell>{a.responsable}</TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedAsset(a);
                                setIsDetailsOpen(true);
                                setIsAddingHistory(false);
                                setIsEditing(false);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {userRole !== 'estandar' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Dar de baja este activo?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción moverá el equipo {a.id} al registro histórico de bajas.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAsset(a.id)}>Confirmar Baja</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredAssets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            No se encontraron activos.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deleted">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Fecha Baja</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeletedAssets.map((a: any) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-bold text-destructive">{a.id}</TableCell>
                          <TableCell>{a.name}</TableCell>
                          <TableCell>{a.deletionDate}</TableCell>
                          <TableCell>{a.reason}</TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedAsset(a);
                                setIsDetailsOpen(true);
                                setIsAddingHistory(false);
                                setIsEditing(false);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {userRole !== 'estandar' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary"
                                onClick={() => handleRestoreAsset(a.id)}
                              >
                                <RefreshCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredDeletedAssets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            No hay activos eliminados.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
                <DialogTitle className="text-2xl font-headline flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Hoja de Vida: {selectedAsset?.id}
                </DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> PDF
                  </Button>
                  {userRole !== 'estandar' && !isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                      <Pencil className="h-4 w-4 mr-2" /> Editar
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>
            <div className="pt-6">
              {isEditing ? (
                <AssetForm
                  assetType={selectedAsset?.category}
                  assetToEdit={selectedAsset}
                  onBack={() => setIsEditing(false)}
                  onSaveSuccess={() => {
                    setIsEditing(false);
                    setIsDetailsOpen(false);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-muted/30 p-6 border-none shadow-none">
                      <h3 className="text-sm font-bold text-primary uppercase mb-6 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Datos del Equipo
                      </h3>
                      <div className="grid grid-cols-1 gap-6 text-sm">
                        <div className="flex flex-col border-b pb-3">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Responsable</span>
                          <span className="font-bold text-base">{selectedAsset?.responsable}</span>
                        </div>
                        <div className="flex flex-col border-b pb-3">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">S/N Serial</span>
                          <span className="font-code text-primary font-bold">{selectedAsset?.serialNumber}</span>
                        </div>
                        <div className="flex flex-col border-b pb-3">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Marca / Modelo</span>
                          <span className="font-bold">{selectedAsset?.brand} {selectedAsset?.model}</span>
                        </div>
                        <div className="flex flex-col border-b pb-3">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Hostname</span>
                          <span className="font-bold">{selectedAsset?.networkName || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col border-b pb-3">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Factura</span>
                          <span className="font-bold">{selectedAsset?.invoiceNumber || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col border-b pb-3">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Fecha Compra</span>
                          <span className="font-bold">{selectedAsset?.purchaseDate}</span>
                        </div>
                      </div>
                    </Card>

                    {(selectedAsset?.category === 'Equipo de cómputo') && (
                      <Card className="bg-muted/30 p-6 border-none shadow-none">
                        <h3 className="text-sm font-bold text-primary uppercase mb-6 flex items-center gap-2">
                          <Cpu className="h-4 w-4" /> Hardware Técnico
                        </h3>
                        <div className="space-y-8">
                          <div className="bg-background p-5 rounded-xl border flex flex-col gap-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Procesador</span>
                            <div className="font-bold flex items-center gap-3 text-lg text-primary">
                              <Cpu className="h-5 w-5" />
                              {selectedAsset?.processor}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                              Generación: {selectedAsset?.processorGen || 'Desconocida'}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <span className="text-xs font-bold text-muted-foreground uppercase px-2">Memoria RAM</span>
                            <div className="grid grid-cols-1 gap-4">
                              {selectedAsset?.rams?.map((r: any, i: number) => (
                                <div key={i} className="bg-background p-5 rounded-xl border flex flex-col gap-2">
                                  <span className="text-[10px] font-bold text-muted-foreground">MÓDULO {i + 1}</span>
                                  <div className="font-bold text-lg">{r.size}</div>
                                  <div className="text-xs text-primary font-bold uppercase">{r.type}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <span className="text-xs font-bold text-muted-foreground uppercase px-2">Almacenamiento</span>
                            <div className="grid grid-cols-1 gap-4">
                              {selectedAsset?.storages?.map((s: any, i: number) => (
                                <div key={i} className="bg-background p-5 rounded-xl border flex flex-col gap-2">
                                  <span className="text-[10px] font-bold text-muted-foreground">UNIDAD {i + 1}</span>
                                  <div className="font-bold text-lg">{s.size}</div>
                                  <div className="text-xs text-accent font-bold uppercase">{s.type}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {(userRole === 'admin' || userRole === 'tecnico') && (selectedAsset?.category === 'Equipo de cómputo') && (
                      <Card className="bg-muted/30 p-6 border-none shadow-none">
                        <h3 className="text-sm font-bold text-primary uppercase mb-6 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" /> Software & Licencias
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="p-5 bg-background rounded-xl border space-y-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-muted-foreground uppercase">Sistema Operativo</span>
                              <p className="font-bold text-lg text-primary">{selectedAsset?.os}</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Key Windows</span>
                              <p className="font-code text-sm break-all font-bold">{selectedAsset?.osKey || 'NO REGISTRADA'}</p>
                            </div>
                          </div>

                          <div className="p-5 bg-background rounded-xl border space-y-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-muted-foreground uppercase">Microsoft Office</span>
                              <p className="font-bold text-lg text-primary">{selectedAsset?.officeVersion}</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-accent">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Key Office</span>
                              <p className="font-code text-sm break-all font-bold">{selectedAsset?.officeKey || 'NO REGISTRADA'}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    <div className="flex flex-col gap-4">
                      {!isAddingHistory && userRole !== 'estandar' && (
                        <Button className="w-full h-12 font-bold shadow-md" onClick={() => setIsAddingHistory(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Añadir Registro
                        </Button>
                      )}
                      
                      {isAddingHistory && (
                        <AddHistoryForm 
                          assetId={selectedAsset?.id} 
                          onCancel={() => setIsAddingHistory(false)} 
                          onSaveSuccess={() => {
                            setIsAddingHistory(false);
                          }} 
                        />
                      )}
                    </div>
                    
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
