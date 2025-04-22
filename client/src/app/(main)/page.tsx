import { Book as IBook } from "@/lib/interfaces/book";
import { backend, IResponse } from "@/lib/scripts/backend";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import Book from "./book-component";
import HomeHeader from "./header";
import dayjs from "dayjs";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const allBooks = await backend
    .get("/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: AxiosResponse<IResponse<IBook[]>>) => res.data.data);

  const overdueBooks = allBooks.filter((book) => book.borrowedBy && dayjs(book.returnDate).isBefore(dayjs()));
  return (
    <>
      <HomeHeader overdueBooks={overdueBooks} />
      <section className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 p-4 max-w-[1600px]">
          {allBooks.map((book) => (
            <Book data={book} key={book._id} />
          ))}
        </div>
      </section>
    </>
  );
}
