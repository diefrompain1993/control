import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, PencilLine, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/auth/authContext';
import { roleLabels } from '@/auth/roles';
import type { Role } from '@/auth/types';
import { addStoredUser, deleteUser, getAllUsers, updateUser, userExists } from '@/auth/userStore';
import {
  getCurrentTimestamp,
  getLastLoginByEmail,
  setLastLoginByEmail
} from '@/auth/authService';
import { addAuditLogEntry } from '@/app/utils/auditLog';
import { getNameWithInitials } from '@/app/utils/name';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select } from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/app/components/ui/drawer';
import { usePaginatedPageScroll } from '@/app/hooks/use-paginated-page-scroll';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeFullName = (value: string) => value.trim().replace(/\s+/g, ' ');

const parseDateTimeToTimestamp = (value: string) => {
  if (!value || value === '—') return null;
  const [datePart, timePart] = value.split(' ');
  if (!datePart || !timePart) return null;
  const [day, month, year] = datePart.split('.').map((part) => Number(part));
  if (!day || !month || !year) return null;
  const [hours = 0, minutes = 0, seconds = 0] = timePart
    .split(':')
    .map((part) => Number(part));
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
};

export function Users() {
  const { user: currentUser } = useAuth();
  const canManageUser = currentUser?.role === 'office_admin';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastLoginSort, setLastLoginSort] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const tableHostRef = useRef<HTMLDivElement | null>(null);
  const { handlePageChange, resetPageScrollMemory } = usePaginatedPageScroll({
    currentPage,
    setCurrentPage,
    hostRef: tableHostRef
  });
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    role?: string;
    form?: string;
  }>({});
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: ''
  });
  const [editErrors, setEditErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    role?: string;
    form?: string;
  }>({});

  const users = useMemo(() => {
    return getAllUsers().map((entry) => ({
      fullName: entry.fullName,
      email: entry.email,
      password: entry.password,
      role: entry.role,
      lastLogin: getLastLoginByEmail(entry.email) ?? entry.lastLogin ?? '—'
    }));
  }, [refreshKey]);

  const sortedUsers = useMemo(() => {
    const next = [...users];
    next.sort((a, b) => {
      const aValue = parseDateTimeToTimestamp(a.lastLogin);
      const bValue = parseDateTimeToTimestamp(b.lastLogin);
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      const diff = aValue - bValue;
      return lastLoginSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [users, lastLoginSort]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const displayedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage]);

  useEffect(() => {
    resetPageScrollMemory();
    setCurrentPage(1);
  }, [lastLoginSort, refreshKey, resetPageScrollMemory]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const roleOptions = [
    { value: 'admin', label: roleLabels.admin },
    { value: 'office_admin', label: roleLabels.office_admin },
    { value: 'guard', label: roleLabels.guard }
  ];

  const resetForm = () => {
    setForm({ fullName: '', email: '', password: '', role: '' });
    setErrors({});
  };

  const resetEditForm = () => {
    setEditForm({ fullName: '', email: '', password: '', role: '' });
    setEditErrors({});
    setEditingEmail(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      resetEditForm();
    }
  };

  const openEditDialog = (email: string) => {
    const current = getAllUsers().find((entry) => entry.email === email);
    if (!current) return;

    setEditingEmail(email);
    setEditForm({
      fullName: current.fullName,
      email: current.email,
      password: '',
      role: current.role
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleCreateUser = () => {
    const normalizedName = normalizeFullName(form.fullName);
    const normalizedEmail = form.email.trim().toLowerCase();
    const nextErrors: typeof errors = {};

    if (!normalizedName) {
      nextErrors.fullName = 'Введите ФИО.';
    } else if (normalizedName.split(/\s+/).length < 3) {
      nextErrors.fullName = 'Укажите фамилию, имя и отчество.';
    }

    if (!normalizedEmail) {
      nextErrors.email = 'Введите email.';
    } else if (!emailRegex.test(normalizedEmail)) {
      nextErrors.email = 'Введите корректный email.';
    }

    if (!form.password) {
      nextErrors.password = 'Введите пароль.';
    } else if (form.password.length < 10) {
      nextErrors.password = 'Пароль должен быть не короче 10 символов.';
    }

    if (!form.role) {
      nextErrors.role = 'Выберите роль.';
    }

    if (!nextErrors.email && userExists(normalizedEmail)) {
      nextErrors.email = 'Пользователь с таким email уже существует.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const timestamp = getCurrentTimestamp();
    setLastLoginByEmail(normalizedEmail, timestamp);

    try {
      addStoredUser({
        email: normalizedEmail,
        password: form.password,
        role: form.role as Role,
        fullName: normalizedName,
        lastLogin: timestamp
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось создать пользователя.';
      setErrors({ form: message });
      return;
    }

    const creatorName = getNameWithInitials(currentUser?.fullName, '—');
    const newUserName = normalizedName;

    addAuditLogEntry({
      timestamp,
      user: creatorName,
      action: 'Создан пользователь',
      target: newUserName,
      details: `Создал: ${creatorName} · ФИО: ${normalizedName} · Email: ${normalizedEmail} · Роль: ${roleLabels[form.role as Role]} · Пароль: ${form.password}`
    });

    setRefreshKey((prev) => prev + 1);
    setDialogOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    const normalizedName = normalizeFullName(editForm.fullName);
    const normalizedEmail = editForm.email.trim().toLowerCase();
    const nextErrors: typeof editErrors = {};

    if (!editingEmail) {
      nextErrors.form = 'Не удалось определить пользователя.';
    }

    const currentEntry = editingEmail
      ? getAllUsers().find((entry) => entry.email === editingEmail)
      : undefined;

    if (!currentEntry) {
      nextErrors.form = 'Не удалось определить пользователя.';
    }

    if (!normalizedName) {
      nextErrors.fullName = 'Введите ФИО.';
    } else if (normalizedName.split(/\s+/).length < 3) {
      nextErrors.fullName = 'Укажите фамилию, имя и отчество.';
    }

    if (!normalizedEmail) {
      nextErrors.email = 'Введите email.';
    } else if (!emailRegex.test(normalizedEmail)) {
      nextErrors.email = 'Введите корректный email.';
    } else if (currentEntry && normalizedEmail !== currentEntry.email && userExists(normalizedEmail)) {
      nextErrors.email = 'Пользователь с таким email уже существует.';
    }

    if (!editForm.role) {
      nextErrors.role = 'Выберите роль.';
    }

    if (editForm.password && editForm.password.length < 10) {
      nextErrors.password = 'Пароль должен быть не короче 10 символов.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setEditErrors(nextErrors);
      return;
    }

    const existingName = currentEntry?.fullName.trim().replace(/\s+/g, ' ') ?? '';
    const roleValue = editForm.role as Role;
    const passwordValue = editForm.password.trim();
    const passwordChanged =
      passwordValue.length > 0 && passwordValue !== (currentEntry?.password ?? '');
    const emailChanged = normalizedEmail !== (currentEntry?.email ?? '');
    const roleChanged = roleValue !== currentEntry?.role;
    const nameChanged = normalizedName !== existingName;
    const hasChanges =
      nameChanged || roleChanged || passwordChanged || emailChanged;

    if (!hasChanges) {
      setEditDialogOpen(false);
      resetEditForm();
      return;
    }

    const changes: string[] = [];
    const detailsParts: string[] = [];

    if (nameChanged) {
      changes.push('ФИО');
      detailsParts.push(`ФИО: ${existingName} → ${normalizedName}`);
    }
    if (emailChanged) {
      changes.push('email');
      detailsParts.push(`Email: ${currentEntry?.email ?? ''} → ${normalizedEmail}`);
    }
    if (roleChanged) {
      changes.push('роль');
      detailsParts.push(
        `Роль: ${roleLabels[currentEntry?.role as Role]} → ${roleLabels[roleValue]}`
      );
    }
    if (passwordChanged) {
      changes.push('пароль');
      detailsParts.push('Пароль: изменен');
    }

    let updatedUser = null as ReturnType<typeof updateUser> | null;
    const basePassword = passwordChanged ? passwordValue : (currentEntry?.password ?? '');

    if (emailChanged) {
      try {
        deleteUser(currentEntry!.email);
        updatedUser = addStoredUser({
          email: normalizedEmail,
          password: basePassword,
          role: roleValue,
          fullName: normalizedName,
          lastLogin: currentEntry?.lastLogin ?? '—'
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Не удалось обновить пользователя.';
        setEditErrors({ form: message });
        return;
      }

      const lastLogin = getLastLoginByEmail(currentEntry!.email) ?? currentEntry!.lastLogin;
      if (lastLogin && lastLogin !== '—') {
        setLastLoginByEmail(normalizedEmail, lastLogin);
      }
    } else {
      const updates: Partial<Parameters<typeof updateUser>[1]> = {
        fullName: normalizedName,
        role: roleValue
      };
      if (passwordChanged) {
        updates.password = passwordValue;
      }

      updatedUser = updateUser(editingEmail as string, updates);
      if (!updatedUser) {
        setEditErrors({ form: 'Не удалось обновить пользователя.' });
        return;
      }
    }
    const timestamp = getCurrentTimestamp();
    const editorName = getNameWithInitials(currentUser?.fullName, '—');
    const targetName = normalizedName;
    const action =
      changes.length === 1
        ? changes[0] === 'пароль'
          ? 'Изменен пароль'
          : `Изменено ${changes[0]}`
        : 'Изменены данные пользователя';
    const details = detailsParts.join(' · ');

    addAuditLogEntry({
      timestamp,
      user: editorName,
      action,
      target: targetName,
      details
    });

    setRefreshKey((prev) => prev + 1);
    setEditDialogOpen(false);
    resetEditForm();
  };

  const handleDeleteUser = (email: string, fullName: string) => {
    if (!canManageUser) return;
    const shouldDelete = window.confirm(`Удалить пользователя ${fullName}?`);
    if (!shouldDelete) return;

    deleteUser(email);

    const timestamp = getCurrentTimestamp();
    const editorName = getNameWithInitials(currentUser?.fullName, '—');
    const targetName = fullName;

    addAuditLogEntry({
      timestamp,
      user: editorName,
      action: 'Удален пользователь',
      target: targetName,
      details: `Email: ${email}`
    });

    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl mb-2">Пользователи</h1>
          <p className="text-sm text-gray-600">
            Список пользователей, доступных в системе
          </p>
        </div>

        {canManageUser && (
          <Drawer open={dialogOpen} onOpenChange={handleDialogChange} direction="right">
            <DrawerTrigger asChild>
              <Button icon={<Plus className="w-4 h-4" />}>
                Добавить пользователя
              </Button>
            </DrawerTrigger>
            <DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-xl overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Добавление пользователя</DrawerTitle>
                <DrawerDescription className="text-foreground font-medium">
                  Заполните данные нового пользователя системы.
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-4 px-4 pb-4">
                {errors.form && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors.form}
                  </div>
                )}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleCreateUser();
                  }}
                  className="grid gap-4"
                >
                  <div>
                    <Input
                      label="Фамилия Имя Отчество"
                      value={form.fullName}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, fullName: value }));
                        if (errors.fullName || errors.form) {
                          setErrors((prev) => ({
                            ...prev,
                            fullName: undefined,
                            form: undefined
                          }));
                        }
                      }}
                      placeholder="Иванов Иван Иванович"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Электронная почта"
                      value={form.email}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, email: value }));
                        if (errors.email || errors.form) {
                          setErrors((prev) => ({
                            ...prev,
                            email: undefined,
                            form: undefined
                          }));
                        }
                      }}
                      placeholder="name@example.com"
                      type="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Пароль"
                      value={form.password}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, password: value }));
                        if (errors.password || errors.form) {
                          setErrors((prev) => ({
                            ...prev,
                            password: undefined,
                            form: undefined
                          }));
                        }
                      }}
                      placeholder="Минимум 10 символов"
                      type="password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <Select
                      label="Роль"
                      value={form.role}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, role: value }));
                        if (errors.role || errors.form) {
                          setErrors((prev) => ({
                            ...prev,
                            role: undefined,
                            form: undefined
                          }));
                        }
                      }}
                      options={roleOptions}
                      placeholder="Выберите роль"
                      hidePlaceholderOption
                    />
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                    )}
                  </div>

                  <DrawerFooter className="mt-8 p-0 sm:flex-row sm:justify-start">
                    <Button type="submit">Создать</Button>
                    <Button variant="secondary" onClick={() => handleDialogChange(false)}>
                      Отмена
                    </Button>
                  </DrawerFooter>
                </form>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {canManageUser && (
        <Dialog open={editDialogOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent
            className="max-w-xl"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Редактирование пользователя</DialogTitle>
              <DialogDescription className="text-foreground/80 font-medium">
                Обновите данные пользователя. Пароль можно оставить пустым, если менять не нужно.
              </DialogDescription>
            </DialogHeader>

            {editErrors.form && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {editErrors.form}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleEditUser();
              }}
              className="grid gap-4"
            >
              <div>
                <Input
                  label="Фамилия Имя Отчество"
                  value={editForm.fullName}
                  onChange={(value) => {
                    setEditForm((prev) => ({ ...prev, fullName: value }));
                    if (editErrors.fullName || editErrors.form) {
                      setEditErrors((prev) => ({
                        ...prev,
                        fullName: undefined,
                        form: undefined
                      }));
                    }
                  }}
                  placeholder="Иванов Иван Иванович"
                />
                {editErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{editErrors.fullName}</p>
                )}
              </div>

              <div>
                <Input
                  label="Электронная почта"
                  value={editForm.email}
                  onChange={(value) => {
                    setEditForm((prev) => ({ ...prev, email: value }));
                    if (editErrors.email || editErrors.form) {
                      setEditErrors((prev) => ({
                        ...prev,
                        email: undefined,
                        form: undefined
                      }));
                    }
                  }}
                  placeholder="name@example.com"
                  type="email"
                />
                {editErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{editErrors.email}</p>
                )}
              </div>

              <div>
                <Input
                  label="Новый пароль"
                  value={editForm.password}
                  onChange={(value) => {
                    setEditForm((prev) => ({ ...prev, password: value }));
                    if (editErrors.password || editErrors.form) {
                      setEditErrors((prev) => ({
                        ...prev,
                        password: undefined,
                        form: undefined
                      }));
                    }
                  }}
                  placeholder="Оставьте пустым, если не нужно менять"
                  type="password"
                />
                {editErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{editErrors.password}</p>
                )}
              </div>

              <div>
                <Select
                  label="Роль"
                  value={editForm.role}
                  onChange={(value) => {
                    setEditForm((prev) => ({ ...prev, role: value }));
                    if (editErrors.role || editErrors.form) {
                      setEditErrors((prev) => ({
                        ...prev,
                        role: undefined,
                        form: undefined
                      }));
                    }
                  }}
                  options={roleOptions}
                  placeholder="Выберите роль"
                  hidePlaceholderOption
                />
                {editErrors.role && (
                  <p className="mt-1 text-xs text-red-600">{editErrors.role}</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => handleEditDialogChange(false)}>
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div ref={tableHostRef} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Все пользователи</h2>
          <span className="text-sm text-muted-foreground">Всего: {sortedUsers.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              {canManageUser ? (
                <>
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '10%' }} />
                </>
              ) : (
                <>
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '32%' }} />
                </>
              )}
            </colgroup>
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Email
                </th>
                {canManageUser && (
                  <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                    Пароль
                  </th>
                )}
                <th className="text-center py-4 px-8 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Роль
                </th>
                <th className="text-center py-4 px-8 text-[12px] font-bold uppercase tracking-wider">
                  <div
                    className="inline-flex items-center justify-center gap-1 text-foreground/70 hover:text-foreground cursor-pointer select-none text-[12px] font-bold uppercase tracking-wider"
                    onClick={() => setLastLoginSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  >
                    Последний вход
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setLastLoginSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      }}
                      className="inline-flex items-center hover:text-foreground transition-colors"
                      aria-label="Сортировать"
                    >
                      {lastLoginSort === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </th>
                {canManageUser && (
                  <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayedUsers.map((entry) => (
                <tr
                  key={entry.email}
                  className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                >
                  <td className="py-4 px-6 text-center text-[14px] font-medium text-foreground">
                    {getNameWithInitials(entry.fullName, entry.fullName)}
                  </td>
                  <td className="py-4 px-6 text-center text-[14px] text-foreground/80">
                    {entry.email}
                  </td>
                  {canManageUser && (
                    <td className="py-4 px-6 text-center text-[14px] text-foreground/80 font-mono">
                      {entry.password || '—'}
                    </td>
                  )}
                  <td className="py-4 px-8 text-center text-[14px] text-foreground/80">
                    <span className="mx-auto inline-flex h-9 w-[220px] max-w-full items-center justify-center whitespace-nowrap rounded-full bg-slate-100 px-4 py-1 text-[13px] font-medium text-foreground/80">
                      {roleLabels[entry.role]}
                    </span>
                  </td>
                  <td className="py-4 px-8 text-center text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                    {entry.lastLogin}
                  </td>
                  {canManageUser && (
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditDialog(entry.email)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          aria-label="Редактировать"
                        >
                          <PencilLine className="h-[18px] w-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(entry.email, entry.fullName)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm font-medium text-muted-foreground">
            Показано {displayedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, sortedUsers.length)} из {sortedUsers.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded text-sm transition-smooth ${
                  currentPage === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border hover:bg-muted/50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages || 1, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}








