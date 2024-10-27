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
  const { data: session, status } = useSession();

  // フォーム関連
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // ミューテーションを定義
  const createHabitualWaste = api.habitualWaste.create.useMutation({
    onSuccess: async () => {
      await utils.habitualWaste.read.invalidate();
      reset(); // 成功後にフォームをリセット
    },
  });

  const onSubmit = (data: FormData) => {
    const newTsumo: Omit<HabitualWaste, "id" | "createdAt"> = {
      title: data.title,
      tsumo: Number(data.tsumo),
      userId: session!.user.id,
    };
    createHabitualWaste.mutate(newTsumo);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center space-x-4"
      >
        <div className="flex flex-col">
          <input
            type="text"
            {...register("title", { required: "タイトルは必須です" })}
            className="rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="無駄遣いの内容を入力"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            {...register("tsumo", { required: "値段は必須です" })}
            className="rounded-md border border-gray-600 bg-black bg-opacity-10 p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="無駄遣いの金額を入力"
          />
        </div>
        <div>
          <Button text="追加" pending={createHabitualWaste.isPending} />
        </div>
      </form>
      {errors.title && (
        <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
      )}
      {errors.tsumo && (
        <p className="mt-2 text-sm text-red-500">{errors.tsumo.message}</p>
      )}
    </div>
  );
};

export default AddHabitualWaste;
