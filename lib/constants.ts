// STEAM Areas
export const STEAM_AREAS = [
  'mecanica',
  'eletronica',
  'programacao',
  'cad',
  'estrategia',
  'gestao',
  'marketing',
  'captacao',
  'documentacao',
] as const;

// Languages
export const LANGUAGES = [
  'pt-BR',
  'en-US',
  'es-ES',
] as const;

// Days of week
export const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Segunda' },
  { key: 'tue', label: 'Terça' },
  { key: 'wed', label: 'Quarta' },
  { key: 'thu', label: 'Quinta' },
  { key: 'fri', label: 'Sexta' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
] as const;

// Time slots
export const TIME_SLOTS = [
  '08:00-10:00',
  '10:00-12:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '19:00-21:00',
  '20:00-22:00',
] as const;

// Regions
export const BRAZILIAN_REGIONS = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
] as const;

// Matching weights
export const DEFAULT_MATCHING_WEIGHTS = {
  area: 0.4,
  schedule: 0.25,
  language: 0.15,
  modality: 0.1,
  region: 0.1,
} as const;

// Color tokens
export const COLORS = {
  brand: {
    primary: '#D9043D',
    accent: '#F2B705',
    warm: '#F28705',
  },
  ink: {
    900: '#363432',
  },
  violet: {
    600: '#72588C',
  },
} as const;