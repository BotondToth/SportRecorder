import { User } from './user';

export interface Friendship {
  id: string;
  friendId: string;
  friend: User;
  userId: string;
  user: User;
}
