import axios from "axios";

export interface IResponse<T> {
  status: number;
  message: string;
  data: T;
}
export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
})