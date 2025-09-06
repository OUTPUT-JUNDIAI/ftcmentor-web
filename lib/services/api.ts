// Real API service for production
import api, { ApiResponse, PaginatedResponse } from '@/lib/api';
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

export const apiService = {
  // Auth
  login: async (data: LoginData) => {
    const response = await api.post<ApiResponse<{
      user: User;
      access_token: string;
      refresh_token: string;
    }>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterTeamData | RegisterMentorData, role: 'team' | 'mentor') => {
    const response = await api.post<ApiResponse<{
      user: User;
      access_token: string;
      refresh_token: string;
    }>>('/auth/register', { ...data, role });
    return response.data.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post<ApiResponse<{
      access_token: string;
    }>>('/auth/refresh', { refresh_token: refreshToken });
    return response.data.data;
  },

  // Users
  getMe: async () => {
    const response = await api.get<ApiResponse<User>>('/me');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/me', data);
    return response.data.data;
  },

  // Teams
  getTeams: async (page = 1, limit = 20) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Team>>>(
      `/teams?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getTeam: async (id: string) => {
    const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data.data;
  },

  createTeam: async (data: Partial<Team>) => {
    const response = await api.post<ApiResponse<Team>>('/teams', data);
    return response.data.data;
  },

  updateTeam: async (id: string, data: Partial<Team>) => {
    const response = await api.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data.data;
  },

  // Mentors
  getMentors: async (page = 1, limit = 20, filters?: any) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    const response = await api.get<ApiResponse<PaginatedResponse<Mentor>>>(
      `/mentors?${queryParams}`
    );
    return response.data.data;
  },

  getMentor: async (id: string) => {
    const response = await api.get<ApiResponse<Mentor>>(`/mentors/${id}`);
    return response.data.data;
  },

  createMentor: async (data: Partial<Mentor>) => {
    const response = await api.post<ApiResponse<Mentor>>('/mentors', data);
    return response.data.data;
  },

  updateMentor: async (id: string, data: Partial<Mentor>) => {
    const response = await api.put<ApiResponse<Mentor>>(`/mentors/${id}`, data);
    return response.data.data;
  },

  approveMentor: async (id: string) => {
    const response = await api.patch<ApiResponse<Mentor>>(`/mentors/${id}/approve`);
    return response.data.data;
  },

  // Matches
  getMatches: async (filters?: { teamId?: string; mentorId?: string }) => {
    const queryParams = new URLSearchParams(filters);
    const response = await api.get<ApiResponse<Match[]>>(`/matches?${queryParams}`);
    return response.data.data;
  },

  createMatch: async (data: Partial<Match>) => {
    const response = await api.post<ApiResponse<Match>>('/matches', data);
    return response.data.data;
  },

  updateMatch: async (id: string, data: Partial<Match>) => {
    const response = await api.put<ApiResponse<Match>>(`/matches/${id}`, data);
    return response.data.data;
  },

  // Matching algorithm
  suggestMentors: async (teamId: string) => {
    const response = await api.post<ApiResponse<{
      mentor: Mentor;
      score: number;
      factors: {
        area: number;
        schedule: number;
        language: number;
        modality: number;
        region: number;
      };
    }[]>>('/matching/suggest', { teamId });
    return response.data.data;
  },

  // Sessions
  getSessions: async (filters?: { teamId?: string; mentorId?: string }) => {
    const queryParams = new URLSearchParams(filters);
    const response = await api.get<ApiResponse<Session[]>>(`/sessions?${queryParams}`);
    return response.data.data;
  },

  createSession: async (data: Partial<Session>) => {
    const response = await api.post<ApiResponse<Session>>('/sessions', data);
    return response.data.data;
  },

  updateSession: async (id: string, data: Partial<Session>) => {
    const response = await api.put<ApiResponse<Session>>(`/sessions/${id}`, data);
    return response.data.data;
  },

  // Feedback
  getFeedback: async (toId?: string) => {
    const queryParams = toId ? new URLSearchParams({ toId }) : '';
    const response = await api.get<ApiResponse<Feedback[]>>(`/feedback?${queryParams}`);
    return response.data.data;
  },

  createFeedback: async (data: Partial<Feedback>) => {
    const response = await api.post<ApiResponse<Feedback>>('/feedback', data);
    return response.data.data;
  },

  // Reports
  getReports: async (page = 1, limit = 20) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Report>>>(
      `/reports?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  createReport: async (data: Partial<Report>) => {
    const response = await api.post<ApiResponse<Report>>('/reports', data);
    return response.data.data;
  },

  updateReport: async (id: string, data: Partial<Report>) => {
    const response = await api.put<ApiResponse<Report>>(`/reports/${id}`, data);
    return response.data.data;
  },

  // Metrics
  getMetrics: async () => {
    const response = await api.get<ApiResponse<Metrics>>('/metrics');
    return response.data.data;
  },
};