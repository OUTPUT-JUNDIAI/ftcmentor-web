import { z } from 'zod';

// Enums
export const UserRoleSchema = z.enum(['team', 'mentor', 'admin']);
export const ModalitySchema = z.enum(['online', 'presential', 'hybrid']);
export const MatchStatusSchema = z.enum(['suggested', 'requested', 'accepted', 'declined']);
export const ReportStatusSchema = z.enum(['new', 'reviewing', 'resolved']);
export const CalendarProviderSchema = z.enum(['google', 'calendly']);

// Base Schemas
export const UserSchema = z.object({
  id: z.string(),
  role: UserRoleSchema,
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  verifiedEmail: z.boolean(),
  verifiedPhone: z.boolean(),
  locale: z.string(),
  timezone: z.string(),
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AvailabilitySlotSchema = z.object({
  day: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  slots: z.array(z.string()),
});

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  school: z.string(),
  region: z.string(),
  needs: z.array(z.string()),
  languages: z.array(z.string()),
  availability: z.array(AvailabilitySlotSchema),
  modality: ModalitySchema,
  steamAreas: z.array(z.string()),
  coachContact: z.string(),
  notes: z.string().optional(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MentorSchema = z.object({
  id: z.string(),
  userId: z.string(),
  skillsTech: z.array(z.string()),
  skillsNonTech: z.array(z.string()),
  languages: z.array(z.string()),
  timezone: z.string(),
  availability: z.array(AvailabilitySlotSchema),
  modality: ModalitySchema,
  regions: z.array(z.string()),
  preferences: z.object({
    ageRange: z.string().optional(),
    groupSize: z.string().optional(),
  }),
  bio: z.string(),
  links: z.object({
    linkedin: z.string().optional(),
    website: z.string().optional(),
    github: z.string().optional(),
  }),
  approved: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MatchFactorsSchema = z.object({
  area: z.number(),
  schedule: z.number(),
  language: z.number(),
  modality: z.number(),
  region: z.number(),
});

export const MatchSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  mentorId: z.string(),
  score: z.number(),
  factors: MatchFactorsSchema,
  status: MatchStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  mentorId: z.string(),
  title: z.string(),
  dateISO: z.string(),
  durationMin: z.number(),
  tags: z.array(z.string()),
  notes: z.string().optional(),
  meetingUrl: z.string().optional(),
  calendarProvider: CalendarProviderSchema.optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const FeedbackSchema = z.object({
  id: z.string(),
  from: z.enum(['team', 'mentor']),
  toId: z.string(),
  nps: z.number().min(0).max(10),
  comment: z.string().optional(),
  sessionId: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
});

export const ReportSchema = z.object({
  id: z.string(),
  targetType: z.enum(['user', 'content', 'session']),
  targetId: z.string(),
  reason: z.string(),
  details: z.string().optional(),
  createdBy: z.string(),
  status: ReportStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MetricsSchema = z.object({
  totalTeams: z.number(),
  totalMentors: z.number(),
  totalMatches: z.number(),
  totalSessions: z.number(),
  avgNPS: z.number(),
  flaggedReports: z.number(),
});

// Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const RegisterTeamSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  teamName: z.string().min(2, 'Nome da equipe obrigatório'),
  school: z.string().min(2, 'Escola/organização obrigatória'),
  region: z.string().min(2, 'Região obrigatória'),
  coachContact: z.string().min(2, 'Contato do técnico obrigatório'),
  consent: z.boolean().refine((val) => val === true, 'Consentimento obrigatório'),
});

export const RegisterMentorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  bio: z.string().min(50, 'Bio deve ter pelo menos 50 caracteres'),
  consent: z.boolean().refine((val) => val === true, 'Consentimento obrigatório'),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Mentor = z.infer<typeof MentorSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterTeamData = z.infer<typeof RegisterTeamSchema>;
export type RegisterMentorData = z.infer<typeof RegisterMentorSchema>;
export type Modality = z.infer<typeof ModalitySchema>;