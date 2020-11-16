import { Workout } from './workout';
import { User } from './user';

export interface FeedEntry extends Workout {
  user: User
}
