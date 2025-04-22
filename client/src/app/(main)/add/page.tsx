"use client";

import Input from "@/lib/components/input";
import { backend } from "@/lib/scripts/backend";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AddBookForm {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
}

export default function AddBook() {
  const { control, handleSubmit } = useForm<AddBookForm>();
  const [isLoading, setIsLoading] = useState(false);
  const token = getCookie("token") as string;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleAddBook = async (data: AddBookForm) => {
    setIsLoading(true);
    await backend
      .post("/books", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Something went wrong" });
        }
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col max-w-[1600px] px-4">
      <h1 className="text-3xl font-bold">Add Book</h1>
      {errors.general && (
        <div role="alert" className="alert alert-error mt-4">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <span>{errors.general}</span>
        </div>
      )}
      <form
        onSubmit={handleSubmit(handleAddBook)}
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
          {errors.author && (
            <p className="label text-red-500">{errors.author}</p>
          )}
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
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
}
