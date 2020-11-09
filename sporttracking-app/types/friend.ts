import { User } from 'types';

export interface Friend {
  id: string;
  friendId: string;
  friend: User;
  userId: string;
  user: User;
}
