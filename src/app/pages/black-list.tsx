import { Plus, Search, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, PencilLine, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/auth/authContext';
import { formatPlateNumber, normalizePlateNumber } from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import {
  addStoredVehicle,
  deleteVehicleById,
  getStoredVehiclesByCategory,
  mergeVehicles,
  type StoredVehicle,
  updateVehicleById
} from '@/app/utils/vehicleStore';
import { addAuditLogEntry } from '@/app/utils/auditLog';
import { getCurrentTimestamp } from '@/auth/authService';
import { getNameWithInitials } from '@/app/utils/name';
import { formatDateInput, normalizeDateInput } from '@/app/utils/dateFilter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog';

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};
export function BlackList() {
  const { user } = useAuth();
  const canManage = user?.role === 'office_admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [isLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingVehicle, setEditingVehicle] = useState<StoredVehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<StoredVehicle | null>(null);
  const deleteClearTimeoutRef = useRef<number | null>(null);
  const [form, setForm] = useState({
    owner: '',
    plateNumber: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ owner?: string; plateNumber?: string }>({});

  const vehicles = useMemo(() => {
    return mergeVehicles(BASE_VEHICLES.black, getStoredVehiclesByCategory('black'));
  }, [refreshKey]);

  const filteredData = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const normalizedQuery = normalizePlateNumber(rawQuery);
    const normalizedDate = normalizeDateInput(dateFilter);

    return vehicles.filter((vehicle) => {
      const matchesPlateNumber = normalizedQuery
        ? normalizePlateNumber(vehicle.plateNumber).includes(normalizedQuery)
        : false;
      const matchesOwner = vehicle.owner.toLowerCase().includes(rawQuery);
      const matchesSearch = !rawQuery || matchesPlateNumber || matchesOwner;
      const matchesDate = !normalizedDate || vehicle.addedDate.startsWith(normalizedDate);
      return matchesSearch && matchesDate;
    });
  }, [searchQuery, dateFilter, vehicles]);

  const sortedData = useMemo(() => {
    const next = [...filteredData];
    next.sort((a, b) => {
      const diff = parseDateToTimestamp(a.addedDate) - parseDateToTimestamp(b.addedDate);
      return dateSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [filteredData, dateSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setDateSort('desc');
  };

  const resetForm = () => {
    setForm({ owner: '', plateNumber: '', notes: '' });
    setErrors({});
  };

  const clearDeleteTimeout = () => {
    if (deleteClearTimeoutRef.current) {
      window.clearTimeout(deleteClearTimeoutRef.current);
      deleteClearTimeoutRef.current = null;
    }
  };

  const scheduleDeleteClear = () => {
    clearDeleteTimeout();
    deleteClearTimeoutRef.current = window.setTimeout(() => {
      setVehicleToDelete(null);
      deleteClearTimeoutRef.current = null;
    }, 200);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingVehicle(null);
      resetForm();
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (open) {
      clearDeleteTimeout();
    } else {
      scheduleDeleteClear();
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchQuery((value) => value.trim());
  };

  const openCreateDialog = () => {
    setEditingVehicle(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (vehicle: StoredVehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      owner: vehicle.owner,
      plateNumber: vehicle.plateNumber,
      notes: vehicle.notes ?? ''
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmedOwner = form.owner.trim();
    const normalizedPlate = normalizePlateNumber(form.plateNumber);
    const nextErrors: typeof errors = {};

    if (!trimmedOwner) {
      nextErrors.owner = 'Введите данные владельца.';
    }

    if (!normalizedPlate) {
      nextErrors.plateNumber = 'Введите номер автомобиля.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const notesValue = form.notes.trim() || undefined;

    if (editingVehicle) {
      const existingNotes = editingVehicle.notes ?? '';
      const nextNotes = notesValue ?? '';
      const changes: string[] = [];
      const detailsParts: string[] = ['Список: Чёрный'];
      const formatValue = (value: string | undefined) => (value ? value : '—');

      const hasChanges =
        trimmedOwner !== editingVehicle.owner ||
        normalizedPlate !== editingVehicle.plateNumber ||
        nextNotes !== existingNotes;

      if (!hasChanges) {
        setDialogOpen(false);
        setEditingVehicle(null);
        resetForm();
        return;
      }

      const timestamp = getCurrentTimestamp();
      const creatorName = getNameWithInitials(user?.fullName, '—');

      if (trimmedOwner !== editingVehicle.owner) {
        changes.push('наименование');
        detailsParts.push(`Наименование: ${editingVehicle.owner} → ${trimmedOwner}`);
      }

      if (normalizedPlate !== editingVehicle.plateNumber) {
        changes.push('номер');
        detailsParts.push(`Номер: ${editingVehicle.plateNumber} → ${normalizedPlate}`);
      }

      if (nextNotes !== existingNotes) {
        changes.push('описание');
        detailsParts.push(
          `Описание: ${formatValue(editingVehicle.notes)} → ${formatValue(notesValue)}`
        );
      }

      const action =
        changes.length === 1
          ? changes[0] === 'номер'
            ? 'Изменен номер'
            : `Изменено ${changes[0]}`
          : `Изменено: ${changes.join(', ')}`;

      updateVehicleById({
        ...editingVehicle,
        owner: trimmedOwner,
        plateNumber: normalizedPlate,
        notes: notesValue
      });

      addAuditLogEntry({
        timestamp,
        user: creatorName,
        action,
        target: normalizedPlate,
        details: detailsParts.join(' · ')
      });
    } else {
      const timestamp = getCurrentTimestamp();
      const creatorName = getNameWithInitials(user?.fullName, '—');

      addStoredVehicle('black', {
        owner: trimmedOwner,
        plateNumber: normalizedPlate,
        notes: notesValue
      });

      addAuditLogEntry({
        timestamp,
        user: creatorName,
        action: 'Добавлен автомобиль',
        target: normalizedPlate,
        details: `Список: Чёрный · Владелец: ${trimmedOwner}`
      });
    }

    setRefreshKey((prev) => prev + 1);
    setDialogOpen(false);
    setEditingVehicle(null);
    resetForm();
  };

  const handleDelete = (vehicle: StoredVehicle) => {
    if (!canManage) return;
    deleteVehicleById(vehicle.id);
    const timestamp = getCurrentTimestamp();
    const creatorName = getNameWithInitials(user?.fullName, '—');
    addAuditLogEntry({
      timestamp,
      user: creatorName,
      action: 'Удален автомобиль',
      target: vehicle.plateNumber,
      details: `Список: Чёрный · Владелец: ${vehicle.owner}`
    });

    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteRequest = (vehicle: StoredVehicle) => {
    if (!canManage) return;
    clearDeleteTimeout();
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!vehicleToDelete) return;
    handleDelete(vehicleToDelete);
    setDeleteDialogOpen(false);
    scheduleDeleteClear();
  };

  return (
    <>
      <PageHeader
        title="Чёрный список"
        description="Автомобили с запрещённым доступом"
        actions={
          canManage ? (
            <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateDialog}>
                  Добавить автомобиль
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingVehicle ? 'Редактирование автомобиля' : 'Добавление автомобиля'}
                  </DialogTitle>
                  <DialogDescription className="text-foreground font-medium">
                    {editingVehicle
                      ? 'Обновите данные владельца и автомобиля.'
                      : 'Укажите данные владельца и автомобиля для чёрного списка.'}
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-4">
                    <div>
                      <Input
                        label="Владелец (компания или ФИО)"
                        value={form.owner}
                        onChange={(value) => {
                          setForm((prev) => ({ ...prev, owner: value }));
                          if (errors.owner) {
                            setErrors((prev) => ({ ...prev, owner: undefined }));
                          }
                        }}
                        placeholder="ООО «СМК» или Иванов Иван Иванович"
                      />
                      {errors.owner && (
                        <p className="mt-1 text-xs text-red-600">{errors.owner}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Номер"
                        value={form.plateNumber}
                        onChange={(value) => {
                          setForm((prev) => ({ ...prev, plateNumber: value }));
                          if (errors.plateNumber) {
                            setErrors((prev) => ({ ...prev, plateNumber: undefined }));
                          }
                        }}
                        placeholder="А123ВС"
                      />
                      {errors.plateNumber && (
                        <p className="mt-1 text-xs text-red-600">{errors.plateNumber}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Примечание"
                        value={form.notes}
                        onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
                        placeholder="Например, причина блокировки"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-3 justify-start sm:justify-start">
                    <Button type="submit">
                      {editingVehicle ? 'Сохранить' : 'Создать'}
                    </Button>
                    <Button variant="secondary" onClick={() => handleDialogChange(false)}>
                      Отмена
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <FilterBar>
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px] max-w-[520px]">
            <Input
              label="Поиск по номеру или владельцу"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Введите номер или имя владельца"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-48 min-w-[180px]">
            <Input
              label="Дата добавления"
              value={dateFilter}
              onChange={(value) => setDateFilter(formatDateInput(value))}
              placeholder="ДД.ММ.ГГГГ"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit">Найти</Button>
            <Button type="button" variant="destructive" onClick={handleResetFilters}>
              Сбросить
            </Button>
          </div>
        </form>
      </FilterBar>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Список автомобилей</h2>
          <span className="text-sm text-muted-foreground">Всего: {sortedData.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Номер автомобиля
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Владелец
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Дата добавления
                    {dateSort === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Примечания
                </th>
                {canManage && (
                  <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                    {canManage && (
                      <td className="py-4 px-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      </td>
                    )}
                  </tr>
                ))
              ) : sortedData.length > 0 ? (
                sortedData.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                  >
                    <td className="py-4 px-6 text-[14px] font-semibold text-red-600 font-mono">
                      {formatPlateNumber(vehicle.plateNumber)}
                    </td>
                    <td className="py-4 px-4 text-[14px] text-foreground/80">{vehicle.owner}</td>
                    <td className="py-4 px-4 text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                      {vehicle.addedDate}
                    </td>
                    <td className="py-4 px-4 text-[14px] text-foreground/70">
                      {vehicle.notes || '—'}
                    </td>
                    {canManage && (
                      <td className="py-4 px-4">
                        <div className="relative flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditDialog(vehicle)}
                            className="text-blue-400 transition-colors hover:text-blue-500"
                            aria-label="Редактировать"
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(vehicle)}
                            className="text-red-400 transition-colors hover:text-red-500"
                            aria-label="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="py-8 text-center text-muted-foreground">
                    Нет данных по заданным критериям
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm font-medium text-muted-foreground">
            Всего записей: {sortedData.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            <button className="px-3 py-1 rounded text-sm bg-primary text-primary-foreground">
              1
            </button>

            <button
              disabled
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>


      

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить автомобиль?</DialogTitle>
            <DialogDescription className="text-foreground font-medium">
              {vehicleToDelete
                ? `Номер: ${formatPlateNumber(vehicleToDelete.plateNumber)}. Это действие нельзя отменить.`
                : 'Это действие нельзя отменить.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-start sm:justify-start">
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!vehicleToDelete}
            >
              Да
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteDialogChange(false)}>
              Нет
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
