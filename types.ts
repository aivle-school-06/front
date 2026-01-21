
export interface Partner {
  id: string;
  name: string;
  industry: string;
  healthScore: number;
  lastReview: string;
  status: 'Active' | 'Pending' | 'Risk';
  revenue: string;
}

export interface DecisionTask {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  dueDate: string;
}
