import { User } from "./user";

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: User;
  postId: number;
}