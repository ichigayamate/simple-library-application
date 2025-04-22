import { Book } from "@/lib/interfaces/book";
import { backend, IResponse } from "@/lib/scripts/backend";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Borrowed Books",
};

export default async function BorrowsPage() {
  const token = (await cookies()).get("token")?.value;
  const data = await backend
    .get("/books/borrows", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: AxiosResponse<IResponse<Book[]>>) => res.data.data);

  return (
    <>
      <h1 className="text-3xl font-bold my-4">Borrowed Books</h1>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Customer Name</th>
                <th>Borrowed Book</th>
                <th>Borrow date</th>
                <th>Return date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((book, idx) => (
                <tr key={book._id}>
                  <td>{idx + 1}</td>
                  <td>{book.borrowedBy?.name}</td>
                  <td>
                    <p>{book.title}</p>
                    <p>by: {book.author}</p>
                  </td>
                  <td>{dayjs(book.borrowedDate).format("DD MMMM YYYY")}</td>
                  <td
                    className={
                      dayjs(book.returnDate).isBefore(dayjs())
                        ? "text-red-500"
                        : ""
                    }
                  >
                    <p>{dayjs(book.returnDate).format("DD MMMM YYYY")}</p>
                    {dayjs(book.returnDate).isBefore(dayjs()) ? (
                      <p className="font-bold">
                        Overdue by {dayjs().diff(dayjs(book.returnDate), "day")}{" "}
                        day
                        {dayjs().diff(dayjs(book.returnDate), "day") > 1
                          ? "s"
                          : ""}
                      </p>
                    ) : (
                      <p>
                        ({dayjs(book.returnDate).diff(dayjs(), "day")} days
                        left)
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info shadow-lg my-4">
          <div>
            <span>No borrowed books found!</span>
          </div>
        </div>
      )}
    </>
  );
}
