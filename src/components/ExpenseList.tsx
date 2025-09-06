import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Calendar, Tag, Receipt } from 'lucide-react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');

  const filteredExpenses = expenses
    .filter(expense => filterCategory === 'all' || expense.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const getCategoryInfo = (category: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category);
  };

  if (expenses.length === 0) {
    return (
      <Card className="expense-card p-8 text-center relative overflow-hidden">
        {/* Background illustration effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary-glow/20" />
        </div>
        
        <div className="relative">
          {/* Fun illustration using emojis */}
          <div className="text-6xl mb-4 animate-bounce">
            💸
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-primary mb-2">💸 No expenses yet!</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Start tracking your money today and take control of your finances ✨
            </p>
            <div className="flex justify-center gap-2 text-2xl">
              <span className="animate-pulse">💰</span>
              <span className="animate-pulse delay-100">📊</span>
              <span className="animate-pulse delay-200">🎯</span>
            </div>
          </div>

          <div className="bg-muted/30 rounded-2xl p-4 border border-dashed border-primary/30">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              🌟 Pro tip: Start with small expenses like coffee or lunch!
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <span>👆</span>
              <span>Use the form above to add your first expense</span>
              <span>📝</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="expense-card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-accent/80">
            <Receipt className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Recent Expenses</h2>
            <p className="text-sm text-muted-foreground">💳 Your spending history</p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1 font-semibold">{expenses.length} total</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select value={filterCategory} onValueChange={(value: ExpenseCategory | 'all') => setFilterCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={sortBy} onValueChange={(value: 'date' | 'amount' | 'category') => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
              <SelectItem value="category">Sort by Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category);
          
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-xl border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200 group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl p-2 rounded-lg bg-muted/50">{categoryInfo?.icon}</div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold truncate">{expense.description}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{categoryInfo?.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(expense.date), 'MMM dd')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExpenses.length === 0 && filterCategory !== 'all' && (
        <div className="text-center py-8 text-muted-foreground">
          No expenses found for the selected category.
        </div>
      )}
    </Card>
  );
};