import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/auth/authContext';
import { authMessages } from '@/auth/authService';
import type { User } from '@/auth/types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const nextErrors: typeof errors = {};

    if (!trimmedEmail) {
      nextErrors.email = 'Введите email.';
    } else if (!emailRegex.test(trimmedEmail)) {
      nextErrors.email = 'Введите корректный email.';
    }

    if (!password) {
      nextErrors.password = 'Введите пароль.';
    } else if (password.length < 10) {
      nextErrors.password = 'Пароль должен быть не короче 10 символов.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const user = login(trimmedEmail, password);
      setErrors({});
      onSuccess(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : authMessages.invalidCredentials;
      setErrors({ form: message });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Вход</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Введите email и пароль, чтобы войти в систему.
          </p>
        </div>

        {errors.form && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Электронная почта"
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (errors.email || errors.form) {
                  setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
                }
              }}
              placeholder="name@example.com"
              type="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <Input
              label="Пароль"
              value={password}
              onChange={(value) => {
                setPassword(value);
                if (errors.password || errors.form) {
                  setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                }
              }}
              placeholder="Введите пароль"
              type="password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <Button type="submit" size="md" variant="primary" disabled={false}>
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
