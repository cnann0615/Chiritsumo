"use client";

import { WantedItem } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "~/app/components/Button";
import { api } from "~/trpc/react";

type FormData = {
  name: string;
  price: number;
  url: string;
};

const AddWantedItem = () => {
  const utils = api.useUtils();
  const { data: session, status } = useSession();

  // ミューテーションを定義
  const createWantedItem = api.wantedItem.create.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
      reset(); // 成功後にフォームをリセット
    },
  });

  // フォーム関連
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const newWantedItem: Omit<WantedItem, "id" | "createdAt"> = {
      name: data.name,
      price: Number(data.price),
      userId: session!.user.id,
      url: data.url,
    };
    createWantedItem.mutate(newWantedItem);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">欲しい物</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 flex items-center gap-4"
      >
        <div>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="商品名"
            className="rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            {...register("price", { required: true })}
            placeholder="価格"
            className="rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="url"
            {...register("url", { required: true })}
            placeholder="https://example.com"
            className="rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-24">
          <Button text="追加" pending={createWantedItem.isPending} />
        </div>
      </form>
    </div>
  );
};

export default AddWantedItem;
