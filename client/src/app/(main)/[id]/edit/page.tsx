import { backend, IResponse } from "@/lib/scripts/backend";
import EditForm from "./editform";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { Book } from "@/lib/interfaces/book";

export default async function EditBook({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const token = (await cookies()).get("token")?.value;
  const { id } = await params;
  const bookData = await backend.get(`/books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res: AxiosResponse<IResponse<Book>>) => res.data.data);
  return (
    <div className="flex flex-col max-w-[1600px] px-4">
      <h1 className="text-3xl font-bold">Edit Book</h1>
      <EditForm defaultValues={bookData} />
    </div>
  );
}
