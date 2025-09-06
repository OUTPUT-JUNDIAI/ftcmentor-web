// Service facade that switches between mock and real API
import { mockService } from './mock';
import { apiService } from './api';

const useApi = process.env.NEXT_PUBLIC_USE_API === 'true';

// Export the appropriate service based on environment
export const service = useApi ? apiService : mockService;

// Re-export for convenience
export { mockService, apiService };