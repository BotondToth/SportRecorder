export interface Workout {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  distance: number;
  date: Date
  calories: number;
}
