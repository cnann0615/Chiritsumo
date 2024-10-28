"use client";
import React from "react";
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
  const { data: session } = useSession();
  const { data: habitualWasteList } = api.habitualWaste.read.useQuery();

  const updateTsumoBalance = api.tsumoBalance.update.useMutation({
    onSuccess: async () => {
      await utils.tsumoBalance.read.invalidate();
      reset();
    },
  });
  const createTsumoLog = api.tsumoLog.create.useMutation();

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
    createTsumoLog.mutate(newTsumo);
    updateTsumoBalance.mutate({ tsumo: Number(data.tsumo) });
  };

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
    <div className="flex justify-center p-4 text-gray-300 sm:p-6">
      <div className="w-full max-w-lg">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-100 sm:text-2xl">
          <div className="inline-block">無駄づかいを我慢して</div>
          <div className="inline-block">
            残高を<span className="text-pink-500">つも</span>
            らせ、<div className="inline-block">欲しい物を手に入れよう！!</div>
          </div>
        </h2>

        {/* セレクトボックス */}
        <div className="mb-4 flex justify-center">
          <select
            onChange={handleSelectChange}
            className="w-full max-w-md rounded-md border bg-transparent p-3 text-center text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-[80%]"
          >
            <option value="">無駄づかいリストから選択</option>
            {habitualWasteList?.map((waste) => (
              <option key={waste.id} value={waste.id}>
                {waste.title} / ¥{waste.tsumo}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="md:flex md:items-center md:gap-4">
            <div className="mb-2 flex flex-col md:mb-0 md:w-1/2">
              <input
                type="text"
                {...register("title", { required: "タイトルは必須です" })}
                className="w-full rounded-md border border-gray-600 bg-[#2a273f] p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="タイトルを入力"
              />
            </div>
            <div className="flex flex-col md:w-1/2">
              <input
                type="number"
                {...register("tsumo", { required: "値段は必須です" })}
                className="w-full rounded-md border border-gray-600 bg-[#2a273f] p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="値段を入力"
              />
            </div>
          </div>

          <Button
            text="我慢できた！！！"
            pending={updateTsumoBalance.isPending}
          />

          <div className="flex justify-center space-x-2">
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
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
