import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconBg?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconBg = 'bg-teal-light',
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green',
    negative: 'text-red',
    neutral: 'text-mid',
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-mid font-semibold mb-1">{label}</p>
          <p className="font-syne text-3xl font-bold text-dark dark:text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
}
