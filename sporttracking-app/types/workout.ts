import { User } from './user';
import { Point } from './point';

export interface Workout {
  locationPoints?: Point[];
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  type: string;
  duration: number;
  distance: number;
  date: Date;
  calories: number;
  beersPerWorkout: number;
}
