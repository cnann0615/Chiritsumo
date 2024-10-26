"use client";
import React from "react";
import { useForm } from "react-hook-form";

import Button from "./Button";
import { TsumoLog } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

type FormData = {
  title: string;
  tsumo: number;
};

const AddTsumo = () => {
  const utils = api.useUtils();
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const addTsumoBalance = api.tsumoBalance.add.useMutation({
    onSuccess: async () => {
      await utils.tsumoBalance.read.invalidate();
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    const newTsumo: Omit<TsumoLog, "id"> = {
      title: data.title,
      tsumo: Number(data.tsumo),
      userId: session!.user.id,
    };
    addTsumoBalance.mutate({ tsumo: Number(data.tsumo) });
  };

  return (
    <div className="rounded p-4 shadow-md">
      <p className="mb-4 text-lg font-semibold">つも追加フォーム</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            タイトル
          </label>
          <input
            type="text"
            {...register("title", { required: "タイトルは必須です" })}
            className="rounded border p-2 text-black"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">値段</label>
          <input
            type="number"
            {...register("tsumo", { required: "値段は必須です" })}
            className="rounded border p-2 text-black"
          />
          {errors.tsumo && (
            <p className="mt-1 text-sm text-red-600">{errors.tsumo.message}</p>
          )}
        </div>
        <Button text="追加" pending={addTsumoBalance.isPending} />
      </form>
    </div>
  );
};

export default AddTsumo;
