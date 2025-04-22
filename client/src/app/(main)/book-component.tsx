"use client";

import Modal from "@/lib/components/modal";
import { UserContext } from "@/lib/components/user-context";
import { Book as IBook } from "@/lib/interfaces/book";
import { backend } from "@/lib/scripts/backend";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function Book({
  data,
}: Readonly<{
  data: IBook;
}>) {
  const [borrowBookModal, setBorrowBookModal] = useState(false);
  const [returnBookModal, setReturnBookModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { user, refreshUser } = useContext(UserContext);
  const token = getCookie("token") as string;
  const isBorrowingBook = Boolean(user?.borrowedBook);
  const selfBorrow = user?.borrowedBook?._id === data._id;
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  const handleBorrowBook = async () => {
    await backend
      .post(
        `/books/borrow/${data._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Book borrowed successfully");
        refreshUser().then(() => {
          router.refresh();
        });
      })
      .catch(() => {
        toast.error("Failed to borrow book");
      })
      .finally(() => {
        setBorrowBookModal(false);
      });
  };

  const handleReturnBook = async () => {
    await backend
      .post(
        `/books/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Book returned successfully");
        refreshUser().then(() => {
          router.refresh();
        });
      })
      .catch(() => {
        toast.error("Failed to returned book");
      })
      .finally(() => {
        setReturnBookModal(false);
      });
  };

  const handleDeleteBook = async () => {
    await backend.delete(`/books/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      router.refresh();
    }).catch(() => {
      toast.error("Failed to delete book");
    }).finally(() => {
      setDeleteModal(false);
    });
  };

  return (
    <>
      <div className="flex rounded-xl border border-neutral-300 p-2 gap-2">
        <div className="relative aspect-square w-1/3 min-w-0">
          <Image
            src={`https://image.pollinations.ai/prompt/book%20cover%20with%20title%20%22${data.title}%22%20by%20${data.author}?width=480&height=700&nologo=true`}
            alt={`Book cover of ${data.title} by ${data.author}`}
            width={480}
            height={700}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-full">
            <h2 className="font-bold text-xl">{data.title}</h2>
            <p>By: {data.author}</p>
            <div className="mt-2">
              {!selfBorrow && data.returnDate && (
                <>
                  <p className="text-sm text-neutral-500">
                    Will be available on{" "}
                    {dayjs(data.returnDate).format("DD MMM YYYY")}
                  </p>
                  {isAdmin && (
                    <p className="text-sm text-neutral-500">
                      Borrowed by: {data.borrowedBy?.name}
                    </p>
                  )}
                </>
              )}
              {selfBorrow && (
                <p className="text-sm text-red-500">
                  Return before {dayjs(data.returnDate).format("DD MMM YYYY")}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              {isBorrowingBook && selfBorrow ? (
                <button
                  className="btn btn-block btn-error"
                  onClick={() => setReturnBookModal(true)}
                >
                  Return book
                </button>
              ) : (
                <button
                  className="btn btn-block btn-neutral"
                  onClick={() => setBorrowBookModal(true)}
                  disabled={isBorrowingBook || Boolean(data.borrowedBy)}
                >
                  Borrow this book
                </button>
              )}
            </div>
            {isAdmin && (
              <Menu>
                <MenuButton className="btn btn-ghost btn-circle btn-sm">
                  <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                </MenuButton>
                <MenuItems
                  as="ul"
                  anchor="bottom end"
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 mt-2 shadow-sm outline-0"
                >
                  <MenuItem as="li">
                    <button>Edit</button>
                  </MenuItem>
                  {!data.borrowedBy && (
                    <MenuItem as="li">
                      <button onClick={() => setDeleteModal(true)}>
                        Delete
                      </button>
                    </MenuItem>
                  )}
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={borrowBookModal}
        onClose={() => setBorrowBookModal(false)}
        title={`Borrow ${data.title}?`}
        description="You can't borrow another book until you return this one."
        confirmText="Borrow"
        onConfirm={handleBorrowBook}
      />

      <Modal
        isOpen={returnBookModal}
        onClose={() => setReturnBookModal(false)}
        title={`Return ${data.title}?`}
        description=""
        confirmText="Return book"
        onConfirm={handleReturnBook}
      />

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title={`Delete book ${data.title}?`}
        description=""
        confirmText="Delete book"
        confirmButtonClassName="!btn-error"
        onConfirm={handleDeleteBook}
      />
    </>
  );
}
