"use client";

import { UserContext } from "@/lib/components/user-context";
import { Book } from "@/lib/interfaces/book";
import {
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useContext } from "react";

interface HomeHeaderProps {
  overdueBooks: Book[];
}

export default function HomeHeader({
  overdueBooks,
}: Readonly<HomeHeaderProps>) {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";
  const hasBorrowedBook = Boolean(user?.borrowedBook);
  const isOverdue = dayjs(user?.borrowedBook?.returnDate).isBefore(dayjs());
  dayjs.extend(relativeTime);

  return (
    <>
      <header className="flex items-center justify-center p-12 pt-28 -mx-4 -mt-20 mb-4 bg-gray-800 text-white ">
        <h1 className="text-3xl font-bold">Welcome to Our Library</h1>
      </header>
      <section className="space-y-2">
        {!isOverdue && hasBorrowedBook && (
          <div role="alert" className="alert alert-info">
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>
              Make sure to return <b>{user?.borrowedBook?.title}</b> before{" "}
              {dayjs(user?.borrowedBook?.returnDate).format("DD MMMM YYYY")}
            </span>
          </div>
        )}
        {isOverdue && (
          <div role="alert" className="alert alert-error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <div>
              <h3>You have overdue book return!</h3>
              <p>
                <b>
                  {user?.borrowedBook?.title} by {user?.borrowedBook?.author}
                </b>
                : Overdue by{" "}
                {dayjs(user?.borrowedBook?.returnDate).fromNow(true)} (
                {dayjs(user?.borrowedBook?.returnDate).format("DD MMM YYYY")})
              </p>
            </div>
          </div>
        )}
        {isAdmin && overdueBooks.length > 0 && (
          <div role="alert" className="alert alert-error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <div>
              <h3>Your customers have return overdue: </h3>
              <ol className="list-decimal list-inside">
                {overdueBooks.map((book) => {
                  return (
                    <li key={book._id}>
                      <b>{book.borrowedBy?.name}</b>: {book.title} by{" "}
                      {book.author} must be returned by{" "}
                      {dayjs(book.returnDate).format("DD MMMM YYYY")}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </section>
      {isAdmin && (
        <section className="flex items-center justify-end max-w-[1600px] px-4">
          <Link href="/add" className="btn btn-neutral mt-4">Add Book</Link>
        </section>
      )}
    </>
  );
}
