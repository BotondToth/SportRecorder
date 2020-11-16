import { User } from './user';

export interface Workout {
  id: string;
  userId: string;
  user: User
  title: string;
  description: string;
  type: string;
  duration: number;
  distance: number;
  date: Date
  calories: number;
  beersPerWorkout: number;
}
