import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, BarChart3, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Matching Inteligente',
      description: 'Algoritmo que conecta equipes e mentores baseado em compatibilidade.',
    },
    {
      icon: Calendar,
      title: 'Agendamento Fácil',
      description: 'Sistema integrado para marcar e gerenciar sessões de mentoria.',
    },
    {
      icon: BarChart3,
      title: 'Métricas e Feedback',
      description: 'Acompanhe o progresso com dashboards e sistema de avaliação NPS.',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Ambiente moderado com políticas LGPD e sistema de denúncias.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-brand-primary"></div>
              <span className="font-bold text-xl text-gray-900">FTC Mentor Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Começar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8">
              Conectando
              <span className="text-brand-primary"> Equipes FTC </span>
              com Mentores Especialistas
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Plataforma que facilita o matching entre equipes FTC e mentores voluntários 
              especialistas em STEAM, oferecendo suporte para formação e desenvolvimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=team">
                <Button size="lg" className="w-full sm:w-auto">
                  Sou uma Equipe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register?role=mentor">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Quero ser Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para facilitar a mentoria no ecossistema FTC
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ⚠️ Importante: Escopo da Plataforma
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                • Esta plataforma <strong>não substitui canais oficiais</strong> do FIRST Tech Challenge (FTC)
              </p>
              <p>
                • <strong>Não gerenciamos inscrições</strong> em competições ou eventos oficiais
              </p>
              <p>
                • O foco é exclusivamente na <strong>mentoria e formação</strong> de equipes
              </p>
              <p>
                • Sempre consulte os canais oficiais do FTC para informações sobre competições e regras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-6 w-6 rounded-full bg-brand-primary"></div>
              <span className="font-semibold text-gray-900">FTC Mentor Platform</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Conectando o futuro da robótica através da mentoria
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-900">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Termos de Uso
              </Link>
              <Link href="/lgpd" className="hover:text-gray-900">
                LGPD
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}