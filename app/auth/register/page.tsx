'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuthStore } from '@/lib/stores/auth';
import { service } from '@/lib/services';
import { RegisterTeamSchema, RegisterMentorSchema, type RegisterTeamData, type RegisterMentorData } from '@/types';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const initialRole = (searchParams?.get('role') as 'team' | 'mentor') || 'team';
  const [selectedRole, setSelectedRole] = useState<'team' | 'mentor'>(initialRole);

  const teamForm = useForm<RegisterTeamData>({
    resolver: zodResolver(RegisterTeamSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      teamName: '',
      school: '',
      region: '',
      coachContact: '',
      consent: false,
    },
  });

  const mentorForm = useForm<RegisterMentorData>({
    resolver: zodResolver(RegisterMentorSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      consent: false,
    },
  });

  const onSubmitTeam = async (data: RegisterTeamData) => {
    setIsLoading(true);
    try {
      const response = await service.register(data, 'team');
      login(response.user, response.access_token, response.refresh_token);
      
      toast.success('Conta criada com sucesso!');
      router.push('/onboarding/team');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitMentor = async (data: RegisterMentorData) => {
    setIsLoading(true);
    try {
      const response = await service.register(data, 'mentor');
      login(response.user, response.access_token, response.refresh_token);
      
      toast.success('Conta criada com sucesso!');
      toast.info('Sua conta será analisada pela equipe de moderação.');
      router.push('/onboarding/mentor');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-brand-primary"></div>
            <span className="font-bold text-xl text-gray-900">FTC Mentors</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-gray-600 mt-2">
            Junte-se à comunidade de mentoria FTC
          </p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>
              Escolha seu tipo de conta e preencha os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'team' | 'mentor')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team">Equipe</TabsTrigger>
                <TabsTrigger value="mentor">Mentor</TabsTrigger>
              </TabsList>

              {/* Team Registration */}
              <TabsContent value="team" className="mt-6">
                <Form {...teamForm}>
                  <form onSubmit={teamForm.handleSubmit(onSubmitTeam)} className="space-y-4">
                    <FormField
                      control={teamForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="teamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da equipe</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da sua equipe FTC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escola/Organização</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da escola ou organização" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Região</FormLabel>
                          <FormControl>
                            <Input placeholder="Sua região" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="coachContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contato do técnico/coach</FormLabel>
                          <FormControl>
                            <Input placeholder="Email do técnico da equipe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Aceito os{' '}
                              <Link href="/terms" className="text-brand-primary underline">
                                Termos de Uso
                              </Link>{' '}
                              e a{' '}
                              <Link href="/privacy" className="text-brand-primary underline">
                                Política de Privacidade
                              </Link>
                            </FormLabel>
                          </div>
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
                          Criando conta...
                        </>
                      ) : (
                        'Criar conta de equipe'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Mentor Registration */}
              <TabsContent value="mentor" className="mt-6">
                <Form {...mentorForm}>
                  <form onSubmit={mentorForm.handleSubmit(onSubmitMentor)} className="space-y-4">
                    <FormField
                      control={mentorForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mentorForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mentorForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mentorForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biografia</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Conte sobre sua experiência, formação e por que quer ser mentor..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mentorForm.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Aceito os{' '}
                              <Link href="/terms" className="text-brand-primary underline">
                                Termos de Uso
                              </Link>{' '}
                              e a{' '}
                              <Link href="/privacy" className="text-brand-primary underline">
                                Política de Privacidade
                              </Link>
                            </FormLabel>
                          </div>
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
                          Criando conta...
                        </>
                      ) : (
                        'Criar conta de mentor'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-brand-primary hover:underline">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}