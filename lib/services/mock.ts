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

// Import mock data
import usersData from '@/mocks/users.json';
import teamsData from '@/mocks/teams.json';
import mentorsData from '@/mocks/mentors.json';
import matchesData from '@/mocks/matches.json';
import sessionsData from '@/mocks/sessions.json';
import feedbackData from '@/mocks/feedback.json';
import reportsData from '@/mocks/reports.json';
import metricsData from '@/mocks/metrics.json';

// Type assertions for imported data
const users = usersData as User[];
const teams = teamsData as Team[];
const mentors = mentorsData as Mentor[];
const matches = matchesData as Match[];
const sessions = sessionsData as Session[];
const feedback = feedbackData as Feedback[];
const reports = reportsData as Report[];
const metrics = metricsData as Metrics;

// Simulate network delay
const mockDelay = () => delay(Math.random() * 1000 + 500);

export const mockService = {
  // Auth
  login: async (data: LoginData) => {
    await mockDelay();
    
    const user = users.find((u) => u.email === data.email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // In real implementation, password would be validated
    return {
      user,
      access_token: `mock_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${user.id}_${Date.now()}`,
    };
  },

  register: async (data: RegisterTeamData | RegisterMentorData, role: 'team' | 'mentor') => {
    await mockDelay();
    
    // Check if email exists
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
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

  refresh: async (refreshToken: string) => {
    await mockDelay();
    
    // Extract user ID from refresh token (mock implementation)
    const userId = refreshToken.split('_')[2];
    const user = users.find((u) => u.id === `user-${userId}`);
    
    if (!user) {
      throw new Error('Invalid refresh token');
    }
    
    return {
      access_token: `mock_token_${user.id}_${Date.now()}`,
    };
  },

  // Users
  getMe: async () => {
    await mockDelay();
    // This would normally get the current user from token
    return users[0];
  },

  // Teams
  getTeams: async () => {
    await mockDelay();
    return teams;
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
      ...data as Team,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    teams.push(newTeam);
    return newTeam;
  },

  // Mentors
  getMentors: async () => {
    await mockDelay();
    return mentors;
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
      ...data as Mentor,
      id: `mentor-${Date.now()}`,
      approved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mentors.push(newMentor);
    return newMentor;
  },

  // Matches
  getMatches: async (teamId?: string, mentorId?: string) => {
    await mockDelay();
    let filteredMatches = matches;
    if (teamId) filteredMatches = filteredMatches.filter((m) => m.teamId === teamId);
    if (mentorId) filteredMatches = filteredMatches.filter((m) => m.mentorId === mentorId);
    return filteredMatches;
  },

  createMatch: async (data: Partial<Match>) => {
    await mockDelay();
    const newMatch: Match = {
      ...data as Match,
      id: `match-${Date.now()}`,
      status: 'suggested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    matches.push(newMatch);
    return newMatch;
  },

  updateMatch: async (id: string, data: Partial<Match>) => {
    await mockDelay();
    const index = matches.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Match não encontrado');
    matches[index] = { ...matches[index], ...data, updatedAt: new Date().toISOString() };
    return matches[index];
  },

  // Sessions
  getSessions: async (teamId?: string, mentorId?: string) => {
    await mockDelay();
    let filteredSessions = sessions;
    if (teamId) filteredSessions = filteredSessions.filter((s) => s.teamId === teamId);
    if (mentorId) filteredSessions = filteredSessions.filter((s) => s.mentorId === mentorId);
    return filteredSessions;
  },

  createSession: async (data: Partial<Session>) => {
    await mockDelay();
    const newSession: Session = {
      ...data as Session,
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    return newSession;
  },

  // Feedback
  getFeedback: async (toId?: string) => {
    await mockDelay();
    let filteredFeedback = feedback;
    if (toId) filteredFeedback = filteredFeedback.filter((f) => f.toId === toId);
    return filteredFeedback;
  },

  createFeedback: async (data: Partial<Feedback>) => {
    await mockDelay();
    const newFeedback: Feedback = {
      ...data as Feedback,
      id: `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    feedback.push(newFeedback);
    return newFeedback;
  },

  // Reports
  getReports: async () => {
    await mockDelay();
    return reports;
  },

  createReport: async (data: Partial<Report>) => {
    await mockDelay();
    const newReport: Report = {
      ...data as Report,
      id: `report-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reports.push(newReport);
    return newReport;
  },

  updateReport: async (id: string, data: Partial<Report>) => {
    await mockDelay();
    const index = reports.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Denúncia não encontrada');
    reports[index] = { ...reports[index], ...data, updatedAt: new Date().toISOString() };
    return reports[index];
  },

  // Metrics
  getMetrics: async () => {
    await mockDelay();
    return metrics;
  },

  // Matching algorithm (frontend implementation)
  suggestMentors: async (teamId: string) => {
    await mockDelay();
    
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Equipe não encontrada');
    
    const availableMentors = mentors.filter((m) => m.approved);
    
    // Calculate matching scores using the algorithm
    const scoredMatches = availableMentors.map((mentor) => {
      const score = calculateMatchingScore(team, mentor);
      return {
        mentor,
        score: Math.round(score),
        factors: calculateFactors(team, mentor),
      };
    });
    
    // Sort by score descending
    return scoredMatches.sort((a, b) => b.score - a.score);
  },
};

// Matching algorithm implementation
function calculateMatchingScore(team: Team, mentor: Mentor): number {
  const factors = calculateFactors(team, mentor);
  const weights = {
    area: 0.4,
    schedule: 0.25,
    language: 0.15,
    modality: 0.1,
    region: 0.1,
  };
  
  return (
    factors.area * weights.area +
    factors.schedule * weights.schedule +
    factors.language * weights.language +
    factors.modality * weights.modality +
    factors.region * weights.region
  );
}

function calculateFactors(team: Team, mentor: Mentor) {
  return {
    area: calculateAreaMatch(team.steamAreas, [...mentor.skillsTech, ...mentor.skillsNonTech]),
    schedule: calculateScheduleMatch(team.availability, mentor.availability),
    language: calculateLanguageMatch(team.languages, mentor.languages),
    modality: calculateModalityMatch(team.modality, mentor.modality),
    region: calculateRegionMatch(team.region, mentor.regions, mentor.modality),
  };
}

function calculateAreaMatch(teamAreas: string[], mentorSkills: string[]): number {
  const intersection = teamAreas.filter((area) => mentorSkills.includes(area));
  if (teamAreas.length === 0) return 0;
  return (intersection.length / teamAreas.length) * 100;
}

function calculateScheduleMatch(teamAvailability: any[], mentorAvailability: any[]): number {
  let totalMatches = 0;
  let totalSlots = 0;
  
  teamAvailability.forEach((teamDay) => {
    const mentorDay = mentorAvailability.find((m) => m.day === teamDay.day);
    if (mentorDay) {
      teamDay.slots.forEach((teamSlot: string) => {
        totalSlots++;
        if (mentorDay.slots.includes(teamSlot)) {
          totalMatches++;
        }
      });
    } else {
      totalSlots += teamDay.slots.length;
    }
  });
  
  return totalSlots > 0 ? (totalMatches / totalSlots) * 100 : 0;
}

function calculateLanguageMatch(teamLanguages: string[], mentorLanguages: string[]): number {
  const intersection = teamLanguages.filter((lang) => mentorLanguages.includes(lang));
  if (teamLanguages.length === 0) return 0;
  return (intersection.length / teamLanguages.length) * 100;
}

function calculateModalityMatch(teamModality: string, mentorModality: string): number {
  if (teamModality === mentorModality) return 100;
  if (teamModality === 'hybrid' || mentorModality === 'hybrid') return 50;
  return 0;
}

function calculateRegionMatch(teamRegion: string, mentorRegions: string[], mentorModality: string): number {
  if (mentorModality === 'online') return 100; // Online ignores region
  if (mentorRegions.includes(teamRegion)) return 100;
  return 0;
}