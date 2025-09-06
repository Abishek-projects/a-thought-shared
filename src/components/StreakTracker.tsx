import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Trophy, Star } from 'lucide-react';
import { Expense } from '@/types/expense';

interface StreakTrackerProps {
  expenses: Expense[];
}

export const StreakTracker = ({ expenses }: StreakTrackerProps) => {
  // Calculate streak (consecutive days with expenses)
  const calculateStreak = () => {
    if (expenses.length === 0) return 0;
    
    const today = new Date();
    const sortedExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasExpenseOnDate = sortedExpenses.some(expense => 
        expense.date.split('T')[0] === dateStr
      );
      
      if (hasExpenseOnDate) {
        streak++;
      } else if (i > 0) { // Allow for today to be empty
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const streak = calculateStreak();
  const totalExpenses = expenses.length;
  const daysActive = new Set(expenses.map(e => e.date.split('T')[0])).size;

  const achievements = [
    {
      icon: Flame,
      title: 'Tracking Streak',
      value: `${streak} day${streak !== 1 ? 's' : ''}`,
      description: streak > 0 ? '🔥 Keep it going!' : '💪 Start your streak today!',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      achieved: streak > 0
    },
    {
      icon: Target,
      title: 'Total Entries',
      value: `${totalExpenses}`,
      description: totalExpenses >= 10 ? '🎯 Great progress!' : '📝 Keep adding expenses!',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      achieved: totalExpenses >= 5
    },
    {
      icon: Trophy,
      title: 'Active Days',
      value: `${daysActive}`,
      description: daysActive >= 7 ? '🏆 Consistency champion!' : '📅 Building habits!',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      achieved: daysActive >= 3
    },
    {
      icon: Star,
      title: 'Level',
      value: `${Math.floor(totalExpenses / 5) + 1}`,
      description: '⭐ Expense tracking master!',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      achieved: totalExpenses > 0
    }
  ];

  if (expenses.length === 0) {
    return (
      <Card className="stats-card p-6 text-center">
        <div className="text-4xl mb-3">🎮</div>
        <h3 className="font-bold text-lg mb-2">Gamify Your Finances!</h3>
        <p className="text-sm text-muted-foreground">
          Add expenses to unlock achievements and build streaks! 🏆
        </p>
      </Card>
    );
  }

  return (
    <Card className="stats-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">🎮 Your Progress</h2>
          <p className="text-sm text-muted-foreground">Keep up the great work!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => {
          const IconComponent = achievement.icon;
          
          return (
            <div key={index} className="text-center">
              <div className={`mx-auto mb-2 p-3 rounded-xl ${achievement.bgColor} transition-all duration-300 ${achievement.achieved ? 'scale-110 shadow-lg' : ''}`}>
                <IconComponent className={`h-6 w-6 ${achievement.color} mx-auto`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <p className="font-bold text-lg">{achievement.value}</p>
                  {achievement.achieved && <Badge className="text-xs px-1 py-0 h-4">✓</Badge>}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {streak >= 3 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
          <div className="flex items-center gap-2 text-orange-600">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-bold">🔥 You're on fire! {streak} day streak!</span>
          </div>
        </div>
      )}
    </Card>
  );
};