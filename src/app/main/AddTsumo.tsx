"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { HabitualWaste, TsumoLog } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

type FormData = {
  title: string;
  tsumo: number;
};

const AddTsumo = () => {
  const utils = api.useUtils();
  const { data: session, status } = useSession();
  const { data: habitualWasteList } = api.habitualWaste.read.useQuery();

  // ミューテーションを定義
  const updateTsumoBalance = api.tsumoBalance.update.useMutation({
    onSuccess: async () => {
      await utils.tsumoBalance.read.invalidate();
      reset();
    },
  });
  const addTsumoLog = api.tsumoLog.create.useMutation();

  // フォーム関連
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const newTsumo: Omit<TsumoLog, "id" | "createdAt"> = {
      title: data.title,
      tsumo: Number(data.tsumo),
      userId: session!.user.id,
    };
    addTsumoLog.mutate(newTsumo);
    updateTsumoBalance.mutate({ tsumo: Number(data.tsumo) });
  };

  // セレクト変更時にタイトルと値段を自動入力
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWaste = habitualWasteList?.find(
      (waste) => waste.id === event.target.value,
    );
    if (selectedWaste) {
      setValue("title", selectedWaste.title);
      setValue("tsumo", selectedWaste.tsumo);
    } else {
      setValue("title", "");
      setValue("tsumo", 0);
    }
  };

  return (
    <div className="flex justify-center p-6 text-gray-300">
      <div>
        <h2 className="mb-6 flex justify-center text-2xl font-bold text-gray-100">
          無駄遣いの我慢を記録しよう！
        </h2>
        {/* セレクトボックス */}
        <div className="mb-4 flex justify-center">
          <select
            onChange={handleSelectChange}
            className="w-[80%] rounded-md border bg-transparent p-3 text-center text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">無駄リストから選択</option>
            {habitualWasteList?.map((waste) => (
              <option key={waste.id} value={waste.id}>
                {waste.title} / ¥{waste.tsumo}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="md: flex md:items-center md:gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                {...register("title", { required: "タイトルは必須です" })}
                className="rounded-md border border-gray-600 bg-[#2a273f] p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="タイトルを入力"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                {...register("tsumo", { required: "値段は必須です" })}
                className="rounded-md border border-gray-600 bg-[#2a273f] p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="値段を入力"
              />
            </div>
          </div>

          <Button
            text="我慢できた！！！"
            pending={updateTsumoBalance.isPending}
          />
          <div className="flex justify-center">
            {errors.title && (
              <p className="mr-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
            {errors.tsumo && (
              <p className="text-sm text-red-500">{errors.tsumo.message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTsumo;
