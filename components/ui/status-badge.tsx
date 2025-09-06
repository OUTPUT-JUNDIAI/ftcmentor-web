import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const statusConfig = {
  // Match statuses
  suggested: { label: 'Sugerido', variant: 'secondary' as const },
  requested: { label: 'Solicitado', variant: 'default' as const },
  accepted: { label: 'Aceito', variant: 'default' as const },
  declined: { label: 'Recusado', variant: 'destructive' as const },
  
  // Report statuses
  new: { label: 'Nova', variant: 'destructive' as const },
  reviewing: { label: 'Em Análise', variant: 'secondary' as const },
  resolved: { label: 'Resolvida', variant: 'default' as const },
  
  // General statuses
  active: { label: 'Ativo', variant: 'default' as const },
  inactive: { label: 'Inativo', variant: 'secondary' as const },
  pending: { label: 'Pendente', variant: 'secondary' as const },
  approved: { label: 'Aprovado', variant: 'default' as const },
  rejected: { label: 'Rejeitado', variant: 'destructive' as const },
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  const badgeVariant = variant || config?.variant || 'secondary';
  const label = config?.label || status;

  return (
    <Badge variant={badgeVariant} className={cn('capitalize', className)}>
      {label}
    </Badge>
  );
}