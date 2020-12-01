import { User } from './user';

export interface Friendship {
  workoutSharedWith?: boolean;
  id: string;
  friendId: string;
  friend: User;
  userId: string;
  user: User;
}
