"use client";
import { HabitualWaste } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import Button from "../../components/Button";

type FormData = {
  title: string;
  tsumo: number;
};

const AddHabitualWaste = () => {
  const utils = api.useUtils();
  const { data: session } = useSession();

  // ミューテーションを定義
  const createHabitualWaste = api.habitualWaste.create.useMutation({
    onSuccess: async () => {
      await utils.habitualWaste.read.invalidate();
      reset();
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
    const newTsumo: Omit<HabitualWaste, "id" | "createdAt"> = {
      title: data.title,
      tsumo: Number(data.tsumo),
      userId: session!.user.id,
    };
    createHabitualWaste.mutate(newTsumo);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-gray-100 sm:text-2xl">
        無駄づかいリスト
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <input
            type="text"
            {...register("title", { required: "タイトルは必須です" })}
            className="w-full rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="無駄遣いの内容を入力"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="number"
            {...register("tsumo", {
              required: "値段は必須です",
              validate: (value) =>
                value > 0 || "値段は正の数である必要があります",
            })}
            className="w-full rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="無駄遣いの金額を入力"
          />
          {errors.tsumo && (
            <p className="mt-1 text-sm text-red-500">{errors.tsumo.message}</p>
          )}
        </div>
        <div className="sm:w-auto">
          <Button text="Add" pending={createHabitualWaste.isPending} />
        </div>
      </form>
    </div>
  );
};

export default AddHabitualWaste;
