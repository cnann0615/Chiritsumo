"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { Balance, Log } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import confetti from "canvas-confetti";

type FormData = {
  title: string;
  price: number;
};

// 残高追加（無駄づかいの我慢記録）コンポーネント
const AddBalance = () => {
  // キャッシュ更新用
  const utils = api.useUtils();

  // セッション情報取得
  const { data: session } = useSession();

  // ミューテーション定義
  const createLog = api.log.create.useMutation({
    onSuccess: async (newLog) => {
      try {
        await updateBalance.mutateAsync({ balance: Number(newLog.price) });
      } catch (error) {
        console.error("Error updating balance", error);
      }
    },
  });
  const updateBalance = api.balance.update.useMutation({
    onSuccess: async () => {
      try {
        await utils.balance.read.invalidate();
        // クラッカーアニメーション
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    },
  });

  // フォーム関連
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    reset();
    const newLog: Omit<Log, "id" | "createdAt"> = {
      title: data.title,
      price: Number(data.price),
      userId: session!.user.id,
    };
    try {
      await createLog.mutateAsync(newLog);
    } catch (error) {
      console.error("Error updating balance or creating log:", error);
    }
  };

  return (
    <div className="flex justify-center p-4 text-gray-300 sm:p-6">
      <div className="w-full max-w-lg">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-100 sm:text-2xl">
          <div className="block">無駄づかいを我慢して</div>
          <div className="block">欲しい物を手に入れよう！</div>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="md:flex md:items-center md:gap-4">
            <div className="mb-2 flex flex-col md:mb-0 md:w-1/2">
              <input
                type="text"
                {...register("title", { required: "タイトルは必須です" })}
                className="w-full rounded-md border border-gray-600 bg-[#2a273f] p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="我慢したものを入力"
              />
            </div>
            <div className="flex flex-col md:w-1/2">
              <input
                type="number"
                {...register("price", { required: "値段は必須です" })}
                className="w-full rounded-md border border-gray-600 bg-[#2a273f] p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="節約できた額を入力"
              />
            </div>
          </div>
          <div className="mx-auto w-[50%]">
            <Button
              text="我慢できた！！"
              size="large"
              bgColor="pink"
              pending={createLog.isPending}
            />
          </div>

          <div className="flex justify-center space-x-2">
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBalance;
