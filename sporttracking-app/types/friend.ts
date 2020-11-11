import { User } from './user';

export interface Friend {
  id: string;
  friendId: string;
  friend: User;
  userId: string;
  user: User;
}
