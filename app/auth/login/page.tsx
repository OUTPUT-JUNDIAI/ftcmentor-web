'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { useAuthStore } from '@/lib/stores/auth';
import { service } from '@/lib/services';
import { LoginSchema, type LoginData } from '@/types';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await service.login(data);
      login(response.user, response.access_token, response.refresh_token);
      
      toast.success('Login realizado com sucesso!');
      
      // Redirect based on user role
      const redirectPath = response.user.role === 'admin' ? '/admin' : '/dashboard';
      router.push(redirectPath);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-brand-primary"></div>
            <span className="font-bold text-xl text-gray-900">FIRST® Tech Challenge Mentors</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Entre em sua conta</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo de volta à plataforma de mentoria
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Digite seus dados para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-brand-primary hover:underline"
          >
            Esqueceu sua senha?
          </Link>
          <div className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/auth/register" className="text-brand-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 font-semibold">Contas de demonstração:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div><strong>Equipe:</strong> ana@exemplo.com.br | demo123</div>
            <div><strong>Mentor:</strong> carlos@exemplo.com.br | demo123</div>
            <div><strong>Admin:</strong> admin@ftcmentors.com.br | admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}