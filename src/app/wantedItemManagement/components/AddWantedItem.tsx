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
  const { data: session } = useSession();

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
      <h2 className="mb-4 text-xl font-bold text-gray-100 sm:text-2xl">
        欲しい物
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
      >
        <div className="flex-1">
          <input
            type="text"
            {...register("name", { required: "商品名は必須です" })}
            placeholder="商品名"
            className="w-full rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="number"
            {...register("price", {
              required: "価格は必須です",
              validate: (value) =>
                value > 0 || "価格は正の数である必要があります",
            })}
            placeholder="価格"
            className="w-full rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="url"
            {...register("url", {
              required: "URLは必須です",
              pattern: {
                value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                message: "有効なURLを入力してください",
              },
            })}
            placeholder="https://example.com"
            className="w-full rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
          )}
        </div>
        <div className="sm:w-auto">
          <Button text="Add" pending={createWantedItem.isPending} />
        </div>
      </form>
    </div>
  );
};

export default AddWantedItem;
