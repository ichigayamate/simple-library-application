import { Book } from "./book";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  borrowedBook?: Book;
}