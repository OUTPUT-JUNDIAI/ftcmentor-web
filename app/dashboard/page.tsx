'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserAvatar } from '@/components/ui/user-avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useUser, useUserRole } from '@/lib/stores/auth';
import { service } from '@/lib/services';
import { formatDateTime } from '@/lib/utils';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  ArrowRight,
  Search,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import type { Match, Session, Feedback, Metrics } from '@/types';

export default function DashboardPage() {
  const user = useUser();
  const userRole = useUserRole();
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user, userRole]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [matchesData, sessionsData, feedbackData, metricsData] = await Promise.all([
        userRole === 'team' 
          ? service.getMatches({ teamId: user.id }) 
          : userRole === 'mentor' 
            ? service.getMatches({ mentorId: user.id })
            : [],
        userRole === 'team' 
          ? service.getSessions({ teamId: user.id })
          : userRole === 'mentor'
            ? service.getSessions({ mentorId: user.id })
            : [],
        userRole === 'admin' ? [] : service.getFeedback(user.id),
        userRole === 'admin' ? service.getMetrics() : null,
      ]);

      if (Array.isArray(matchesData)) setMatches(matchesData);
      if (Array.isArray(sessionsData)) setSessions(sessionsData);
      if (Array.isArray(feedbackData)) setFeedback(feedbackData);
      if (metricsData) setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'team': return 'Dashboard da Equipe';
      case 'mentor': return 'Dashboard do Mentor';
      case 'admin': return 'Dashboard Administrativo';
      default: return 'Dashboard';
    }
  };

  const getDashboardDescription = () => {
    switch (userRole) {
      case 'team': return 'Acompanhe suas conexões, sessões e feedback';
      case 'mentor': return 'Gerencie suas equipes e sessões de mentoria';
      case 'admin': return 'Métricas e moderação da plataforma';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title={getDashboardTitle()}
        description={getDashboardDescription()}
      />

      <div className="mt-6 space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              {user && <UserAvatar user={user} size="lg" />}
              <div>
                <CardTitle>Bem-vindo, {user?.name}!</CardTitle>
                <CardDescription>
                  {userRole === 'team' && 'Conecte-se com mentores e acelere o desenvolvimento da sua equipe'}
                  {userRole === 'mentor' && 'Compartilhe seu conhecimento e ajude equipes a crescerem'}
                  {userRole === 'admin' && 'Gerencie a plataforma e mantenha a comunidade saudável'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Team Dashboard */}
        {userRole === 'team' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conexões</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{matches.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {matches.filter(m => m.status === 'accepted').length} ativas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total realizadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">NPS Médio</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {feedback.length > 0 
                      ? (feedback.reduce((acc, f) => acc + f.nps, 0) / feedback.length).toFixed(1)
                      : '--'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {feedback.length} avaliações
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Matches */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Conexões Recentes</CardTitle>
                    <CardDescription>Suas últimas conexões com mentores</CardDescription>
                  </div>
                  <Link href="/matches">
                    <Button variant="ghost" size="sm">
                      Ver todas <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {matches.length === 0 ? (
                    <EmptyState
                      title="Nenhuma conexão ainda"
                      description="Comece buscando por mentores"
                      action={{
                        label: "Buscar Mentores",
                        onClick: () => {}
                      }}
                    />
                  ) : (
                    <div className="space-y-3">
                      {matches.slice(0, 3).map((match) => (
                        <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                            <div>
                              <p className="text-sm font-medium">Mentor #{match.mentorId.slice(-6)}</p>
                              <p className="text-xs text-gray-500">Score: {match.score}%</p>
                            </div>
                          </div>
                          <StatusBadge status={match.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Próximas Sessões</CardTitle>
                    <CardDescription>Suas sessões agendadas</CardDescription>
                  </div>
                  <Link href="/sessions">
                    <Button variant="ghost" size="sm">
                      Ver todas <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <EmptyState
                      title="Nenhuma sessão agendada"
                      description="Agende sua primeira sessão com um mentor"
                    />
                  ) : (
                    <div className="space-y-3">
                      {sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{session.title}</p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(session.dateISO)}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">Ver</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/mentors">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar Mentores
                    </Button>
                  </Link>
                  <Link href="/sessions/new">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Sessão
                    </Button>
                  </Link>
                  <Link href="/matches">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ver Conexões
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Mentor Dashboard */}
        {userRole === 'mentor' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Equipes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {matches.filter(m => m.status === 'accepted').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Equipes ativas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total realizadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Solicitações</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {matches.filter(m => m.status === 'requested').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pendentes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações Pendentes</CardTitle>
                  <CardDescription>Equipes que desejam sua mentoria</CardDescription>
                </CardHeader>
                <CardContent>
                  {matches.filter(m => m.status === 'requested').length === 0 ? (
                    <EmptyState
                      title="Nenhuma solicitação pendente"
                      description="Você não tem solicitações no momento"
                    />
                  ) : (
                    <div className="space-y-3">
                      {matches
                        .filter(m => m.status === 'requested')
                        .slice(0, 3)
                        .map((match) => (
                          <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                              <div>
                                <p className="text-sm font-medium">Equipe #{match.teamId.slice(-6)}</p>
                                <p className="text-xs text-gray-500">Score: {match.score}%</p>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button size="sm" variant="outline">Aceitar</Button>
                              <Button size="sm" variant="ghost">Recusar</Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessões Recentes</CardTitle>
                  <CardDescription>Suas últimas sessões de mentoria</CardDescription>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <EmptyState
                      title="Nenhuma sessão realizada"
                      description="Suas sessões aparecerão aqui"
                    />
                  ) : (
                    <div className="space-y-3">
                      {sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{session.title}</p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(session.dateISO)}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">Detalhes</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Admin Dashboard */}
        {userRole === 'admin' && metrics && (
          <>
            {/* Platform Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Equipes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalTeams}</div>
                  <p className="text-xs text-muted-foreground">Total cadastradas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mentores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalMentors}</div>
                  <p className="text-xs text-muted-foreground">Total aprovados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalMatches}</div>
                  <p className="text-xs text-muted-foreground">Conexões ativas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">NPS Médio</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.avgNPS.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Satisfação geral</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Administrativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/admin/metrics">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Ver Métricas
                    </Button>
                  </Link>
                  <Link href="/admin/mentors">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Aprovar Mentores
                    </Button>
                  </Link>
                  <Link href="/admin/reports">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Denúncias ({metrics.flaggedReports})
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Configurações
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}