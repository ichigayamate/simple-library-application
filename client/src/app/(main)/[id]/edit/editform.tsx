"use client";

import Input from "@/lib/components/input";
import { Book } from "@/lib/interfaces/book";
import { backend } from "@/lib/scripts/backend";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface EditBookForm {
  title: string;
  author: string;
  genre: string;
  publishedYear: string;
}

export default function EditForm({
  defaultValues,
}: Readonly<{
  defaultValues: Book;
}>) {
  const { control, handleSubmit } = useForm<EditBookForm>({
    defaultValues,
  });
  const token = getCookie("token") as string;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const id = defaultValues._id;
  const router = useRouter();

  const handleEditBook = async (data: EditBookForm) => {
    setIsLoading(true);
    await backend.put(`/books/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(() => {
      toast.success("Book updated successfully");
      router.push("/");
    }).catch((err) => {
      if (err.response.status === 400) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Something went wrong" });
      }
      setIsLoading(false);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleEditBook)}
      className="flex flex-col gap-4 mt-4"
    >
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Book title</legend>
        <Input
          control={control}
          name="title"
          placeholder="Enter book title"
          required
        />
        {errors.title && <p className="label text-red-500">{errors.title}</p>}
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Book author</legend>
        <Input
          control={control}
          name="author"
          placeholder="Enter book author"
          required
        />
        {errors.author && <p className="label text-red-500">{errors.author}</p>}
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Book genre</legend>
        <Input
          control={control}
          name="genre"
          placeholder="Enter book genre"
          required
        />
        {errors.genre && <p className="label text-red-500">{errors.genre}</p>}
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Year published</legend>
        <Input
          control={control}
          name="publishedYear"
          placeholder="Enter book published year"
          required
          inputMode="numeric"
          pattern="[0-9]*"
          title="Please enter a valid year"
        />
        {errors.publishedYear && (
          <p className="label text-red-500">{errors.publishedYear}</p>
        )}
      </fieldset>
      <div className="mt-4">
        <button
          type="submit"
          className="btn btn-block btn-neutral"
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Edit Book
        </button>
      </div>
    </form>
  );
}
