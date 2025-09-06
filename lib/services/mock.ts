// Mock service for development
import { delay } from '@/lib/utils';
import type {
  User,
  Team,
  Mentor,
  Match,
  Session,
  Feedback,
  Report,
  Metrics,
  LoginData,
  RegisterTeamData,
  RegisterMentorData,
} from '@/types';

// ----------------- Tipos compartilhados -----------------
export type MatchFilter = { teamId?: string; mentorId?: string };

type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

function paginate<T>(items: T[], page = 1, limit = 20): Paginated<T> {
  const start = (page - 1) * limit;
  const end = start + limit;
  return { items: items.slice(start, end), total: items.length, page, limit };
}

// ----------------- Dados mock -----------------
import usersData from '@/mocks/users.json';
import teamsData from '@/mocks/teams.json';
import mentorsData from '@/mocks/mentors.json';
import matchesData from '@/mocks/matches.json';
import sessionsData from '@/mocks/sessions.json';
import feedbackData from '@/mocks/feedback.json';
import reportsData from '@/mocks/reports.json';
import metricsData from '@/mocks/metrics.json';

const users = usersData as User[];
const teams = teamsData as Team[];
const mentors = mentorsData as Mentor[];
const matches = matchesData as Match[];
const sessions = sessionsData as Session[];
const feedback = feedbackData as Feedback[];
const reports = reportsData as Report[];
let metrics = metricsData as Metrics;

// Utils
const mockDelay = () => delay(Math.random() * 1000 + 300);
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ----------------- Mock Service -----------------
export const mockService = {
  // Auth
  login: async (data: LoginData) => {
    await mockDelay();
    const user = users.find((u) => u.email === data.email);
    if (!user) throw new Error('Usuário não encontrado');
    return {
      user,
      access_token: `mock_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${user.id}_${Date.now()}`,
    };
  },

  register: async (data: RegisterTeamData | RegisterMentorData, role: 'team' | 'mentor') => {
    await mockDelay();
    if (users.some((u) => u.email === data.email)) throw new Error('Email já cadastrado');

    const newUser: User = {
      id: uid('user'),
      role,
      name: data.name,
      email: data.email,
      verifiedEmail: false,
      verifiedPhone: false,
      locale: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    return {
      user: newUser,
      access_token: `mock_token_${newUser.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${newUser.id}_${Date.now()}`,
    };
  },

  refresh: async (_refreshToken: string) => {
    await mockDelay();
    // Em mock, apenas devolve um token novo
    return { access_token: `mock_token_${Date.now()}` };
  },

  // Users
  getMe: async () => {
    await mockDelay();
    // Em mock, retorna o primeiro usuário (ajuste se quiser usar token)
    return users[0];
  },

  updateProfile: async (data: Partial<User>) => {
    await mockDelay();
    const me = users[0];
    const i = users.findIndex((u) => u.id === me.id);
    users[i] = { ...me, ...data, updatedAt: new Date().toISOString() };
    return users[i];
  },

  // Teams
  getTeams: async (page = 1, limit = 20) => {
    await mockDelay();
    return paginate<Team>(teams, page, limit);
  },

  getTeam: async (id: string) => {
    await mockDelay();
    const team = teams.find((t) => t.id === id);
    if (!team) throw new Error('Equipe não encontrada');
    return team;
  },

  createTeam: async (data: Partial<Team>) => {
    await mockDelay();
    const newTeam: Team = {
      ...(data as Team),
      id: uid('team'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    teams.push(newTeam);
    metrics.totalTeams = teams.length;
    return newTeam;
  },

  updateTeam: async (id: string, data: Partial<Team>) => {
    await mockDelay();
    const i = teams.findIndex((t) => t.id === id);
    if (i === -1) throw new Error('Equipe não encontrada');
    teams[i] = { ...teams[i], ...data, updatedAt: new Date().toISOString() };
    return teams[i];
  },

  // Mentors
  getMentors: async (
    page = 1,
    limit = 20,
    filters?: Record<string, string | number | boolean | undefined | null>
  ) => {
    await mockDelay();
    let list = mentors.slice();

    if (filters) {
      const region = filters['region'];
      const language = filters['language'];
      const skill = filters['skill'];

      if (region) list = list.filter((m) => m.regions?.includes(String(region)));
      if (language) list = list.filter((m) => m.languages?.includes(String(language)));
      if (skill) {
        const s = String(skill);
        list = list.filter(
          (m) => m.skillsTech?.includes(s) || m.skillsNonTech?.includes(s)
        );
      }
    }

    return paginate<Mentor>(list, page, limit);
  },

  getMentor: async (id: string) => {
    await mockDelay();
    const mentor = mentors.find((m) => m.id === id);
    if (!mentor) throw new Error('Mentor não encontrado');
    return mentor;
  },

  createMentor: async (data: Partial<Mentor>) => {
    await mockDelay();
    const newMentor: Mentor = {
      ...(data as Mentor),
      id: uid('mentor'),
      approved: (data as any)?.approved ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mentors.push(newMentor);
    metrics.totalMentors = mentors.length;
    return newMentor;
  },

  updateMentor: async (id: string, data: Partial<Mentor>) => {
    await mockDelay();
    const i = mentors.findIndex((m) => m.id === id);
    if (i === -1) throw new Error('Mentor não encontrado');
    mentors[i] = { ...mentors[i], ...data, updatedAt: new Date().toISOString() };
    return mentors[i];
  },

  approveMentor: async (id: string) => {
    await mockDelay();
    const i = mentors.findIndex((m) => m.id === id);
    if (i === -1) throw new Error('Mentor não encontrado');
    (mentors[i] as any).approved = true;
    mentors[i].updatedAt = new Date().toISOString() as any;
    return mentors[i];
  },

  // Matches
  getMatches: async (filters?: MatchFilter) => {
    await mockDelay();
    const { teamId, mentorId } = filters ?? {};
    return matches.filter(
      (m) => (teamId ? m.teamId === teamId : true) && (mentorId ? m.mentorId === mentorId : true)
    );
  },

  createMatch: async (data: Partial<Match>) => {
    await mockDelay();
    const newMatch: Match = {
      ...(data as Match),
      id: uid('match'),
      status: (data as any)?.status ?? 'suggested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    matches.push(newMatch);
    metrics.totalMatches = matches.length;
    return newMatch;
  },

  updateMatch: async (id: string, data: Partial<Match>) => {
    await mockDelay();
    const i = matches.findIndex((m) => m.id === id);
    if (i === -1) throw new Error('Match não encontrado');
    matches[i] = { ...matches[i], ...data, updatedAt: new Date().toISOString() };
    return matches[i];
  },

  // Sessions
  getSessions: async (filters?: MatchFilter) => {
    await mockDelay();
    const { teamId, mentorId } = filters ?? {};
    return sessions.filter(
      (s) => (teamId ? s.teamId === teamId : true) && (mentorId ? s.mentorId === mentorId : true)
    );
  },

  createSession: async (data: Partial<Session>) => {
    await mockDelay();
    const newSession: Session = {
      ...(data as Session),
      id: uid('session'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    metrics.totalSessions = sessions.length;
    return newSession;
  },

  updateSession: async (id: string, data: Partial<Session>) => {
    await mockDelay();
    const i = sessions.findIndex((s) => s.id === id);
    if (i === -1) throw new Error('Sessão não encontrada');
    sessions[i] = { ...sessions[i], ...data, updatedAt: new Date().toISOString() };
    return sessions[i];
  },

  // Feedback
  getFeedback: async (toId?: string) => {
    await mockDelay();
    return toId ? feedback.filter((f) => f.toId === toId) : feedback.slice();
  },

  createFeedback: async (data: Partial<Feedback>) => {
    await mockDelay();
    const newFeedback: Feedback = {
      ...(data as Feedback),
      id: uid('feedback'),
      createdAt: new Date().toISOString(),
    };
    feedback.push(newFeedback);
    // Atualiza NPS médio
    const total = feedback.reduce((acc, f) => acc + (f.nps ?? 0), 0);
    metrics.avgNPS = feedback.length ? total / feedback.length : 0;
    return newFeedback;
  },

  // Reports
  getReports: async (page = 1, limit = 20) => {
    await mockDelay();
    return paginate<Report>(reports, page, limit);
  },

  createReport: async (data: Partial<Report>) => {
    await mockDelay();
    const newReport: Report = {
      ...(data as Report),
      id: uid('report'),
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reports.push(newReport);
    metrics.flaggedReports = reports.filter((r) => r.status === 'new').length;
    return newReport;
  },

  updateReport: async (id: string, data: Partial<Report>) => {
    await mockDelay();
    const i = reports.findIndex((r) => r.id === id);
    if (i === -1) throw new Error('Denúncia não encontrada');
    reports[i] = { ...reports[i], ...data, updatedAt: new Date().toISOString() };
    metrics.flaggedReports = reports.filter((r) => r.status === 'new').length;
    return reports[i];
  },

  // Metrics
  getMetrics: async () => {
    await mockDelay();
    return metrics;
  },

  // Matching (mock)
  suggestMentors: async (teamId: string) => {
    await mockDelay();
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Equipe não encontrada');
    const availableMentors = mentors.filter((m: any) => m.approved !== false);

    const ranked = availableMentors.map((mentor) => {
      const score = calculateMatchingScore(team, mentor);
      return { mentor, score: Math.round(score), factors: calculateFactors(team, mentor) };
    });

    return ranked.sort((a, b) => b.score - a.score);
  },
};

// -------- Matching helpers (mock) --------
function calculateMatchingScore(team: Team, mentor: Mentor): number {
  const f = calculateFactors(team, mentor);
  const w = { area: 0.4, schedule: 0.25, language: 0.15, modality: 0.1, region: 0.1 };
  return f.area * w.area + f.schedule * w.schedule + f.language * w.language + f.modality * w.modality + f.region * w.region;
}

function calculateFactors(team: Team, mentor: Mentor) {
  return {
    area: calculateAreaMatch(team.steamAreas as any, [...(mentor.skillsTech as any), ...(mentor.skillsNonTech as any)]),
    schedule: calculateScheduleMatch(team.availability as any, (mentor.availability as any) ?? []),
    language: calculateLanguageMatch(team.languages as any, mentor.languages as any),
    modality: calculateModalityMatch((team as any).modality, (mentor as any).modality),
    region: calculateRegionMatch((team as any).region, (mentor as any).regions ?? [], (mentor as any).modality),
  };
}

function calculateAreaMatch(teamAreas: string[] = [], mentorSkills: string[] = []) {
  const intersection = teamAreas.filter((a) => mentorSkills.includes(a));
  return teamAreas.length ? (intersection.length / teamAreas.length) * 100 : 0;
}

function calculateScheduleMatch(teamAvailability: any[] = [], mentorAvailability: any[] = []) {
  let totalMatches = 0;
  let totalSlots = 0;
  for (const ta of teamAvailability) {
    const md = mentorAvailability.find((m) => m.day === ta.day);
    if (md) {
      for (const slot of ta.slots ?? []) {
        totalSlots++;
        if ((md.slots ?? []).includes(slot)) totalMatches++;
      }
    } else {
      totalSlots += (ta.slots ?? []).length;
    }
  }
  return totalSlots > 0 ? (totalMatches / totalSlots) * 100 : 0;
}

function calculateLanguageMatch(teamLanguages: string[] = [], mentorLanguages: string[] = []) {
  const intersection = teamLanguages.filter((l) => mentorLanguages.includes(l));
  return teamLanguages.length ? (intersection.length / teamLanguages.length) * 100 : 0;
}

function calculateModalityMatch(teamModality: string, mentorModality: string) {
  if (teamModality === mentorModality) return 100;
  if (teamModality === 'hybrid' || mentorModality === 'hybrid') return 50;
  return 0;
}

function calculateRegionMatch(teamRegion: string, mentorRegions: string[] = [], mentorModality: string) {
  if (mentorModality === 'online') return 100; // online ignora região
  if (mentorRegions.includes(teamRegion)) return 100;
  return 0;
}
