import { User } from "./user"

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: string;
  borrowedBy?: User;
  borrowedDate?: string | Date;
}