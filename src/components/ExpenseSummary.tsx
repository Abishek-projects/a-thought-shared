import { Card } from '@/components/ui/card';
import { TrendingUp, Calendar, Clock, Wallet } from 'lucide-react';
import { ExpenseSummary as ExpenseSummaryType } from '@/types/expense';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryType;
}

export const ExpenseSummary = ({ summary }: ExpenseSummaryProps) => {
  const hasAnyExpenses = summary.totalAll > 0;
  
  const summaryCards = [
    {
      title: 'Today',
      amount: summary.totalToday,
      icon: Clock,
      description: hasAnyExpenses ? '💸 Spent today' : '✨ Today\'s goal: $0',
      color: 'text-stat-today',
      bgColor: 'bg-stat-today/10',
      borderColor: 'border-stat-today/20',
      trend: summary.totalToday > 0 ? `$${summary.totalToday.toFixed(0)}` : '🎯',
      progressGoal: 50 // daily goal
    },
    {
      title: 'This Week',
      amount: summary.totalWeek,
      icon: Calendar,
      description: hasAnyExpenses ? '📊 Spent this week' : '🌟 Weekly budget: $200',
      color: 'text-stat-week',
      bgColor: 'bg-stat-week/10',
      borderColor: 'border-stat-week/20',
      trend: summary.totalWeek > 0 ? `${Math.round((summary.totalWeek / 200) * 100)}%` : '💪',
      progressGoal: 200 // weekly goal
    },
    {
      title: 'This Month',
      amount: summary.totalMonth,
      icon: TrendingUp,
      description: hasAnyExpenses ? '📈 Spent this month' : '🚀 Monthly target: $800',
      color: 'text-stat-month',
      bgColor: 'bg-stat-month/10',
      borderColor: 'border-stat-month/20',
      trend: summary.totalMonth > 0 ? `${Math.round((summary.totalMonth / 800) * 100)}%` : '🎉',
      progressGoal: 800 // monthly goal
    },
    {
      title: 'Total',
      amount: summary.totalAll,
      icon: Wallet,
      description: hasAnyExpenses ? '💰 Total spending' : '🌈 Start your journey!',
      color: 'text-stat-total',
      bgColor: 'bg-stat-total/10',
      borderColor: 'border-stat-total/20',
      trend: hasAnyExpenses ? '📊' : '🎯',
      progressGoal: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card) => {
        const IconComponent = card.icon;
        const progressPercentage = card.progressGoal ? Math.min((card.amount / card.progressGoal) * 100, 100) : 0;
        
        return (
          <Card key={card.title} className={`stats-card p-6 ${card.borderColor} border-2 hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {card.title}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${card.bgColor} ${card.color} font-medium`}>
                    {card.trend}
                  </span>
                </div>
                <p className={`text-3xl font-bold mb-1 ${card.amount === 0 ? 'text-muted-foreground' : ''}`}>
                  ${card.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
                
                {/* Progress bar for goals */}
                {card.progressGoal && card.amount > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full`}
                        style={{ 
                          width: `${progressPercentage}%`,
                          background: `hsl(var(--${card.color.replace('text-', '')}))`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {progressPercentage.toFixed(0)}% of goal
                    </p>
                  </div>
                )}
              </div>
              <div className={`p-4 rounded-xl ${card.bgColor} transition-all duration-300 hover:scale-110 shadow-sm`}>
                <IconComponent className={`h-7 w-7 ${card.color}`} />
              </div>
            </div>
            
            {/* Subtle background pattern for empty states */}
            {card.amount === 0 && (
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};