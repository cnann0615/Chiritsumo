import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

// Procedureの定義//////////////////////////////////////////////

export const logRouter = createTRPCRouter({
  // ログの取得
  read: protectedProcedure.query(({ ctx }) => {
    return db.log.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // ログの追加（残高も更新）
  create: protectedProcedure
    .input(z.object({ price: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.$transaction(async (prisma) => {
        const log = await prisma.log.create({
          data: {
            userId: ctx.session.user.id,
            price: input.price,
            title: input.title,
          },
        });

        await prisma.balance.update({
          where: { userId: ctx.session.user.id },
          data: { balance: { increment: input.price } },
        });

        return log; // 作成したログを返す
      });
    }),

  // ログの更新
  update: protectedProcedure
    .input(z.object({ id: z.string(), price: z.number(), title: z.string() }))
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        // 既存のログを取得して、差分を計算
        const existingLog = await prisma.log.findUnique({
          where: { id: input.id },
        });
        if (!existingLog) {
          throw new Error("Log not found");
        }

        const priceDifference = input.price - existingLog.price;

        // ログの更新
        const updatedLog = await prisma.log.update({
          where: { id: input.id },
          data: {
            price: input.price,
            title: input.title,
          },
        });

        // 残高の更新
        await prisma.balance.update({
          where: { userId: existingLog.userId },
          data: { balance: { increment: priceDifference } },
        });

        return updatedLog;
      });
    }),

  // ログの削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        // 削除するログを取得
        const logToDelete = await prisma.log.findUnique({
          where: { id: input.id },
        });
        if (!logToDelete) {
          throw new Error("Log not found");
        }

        // ログの削除
        const deletedLog = await prisma.log.delete({
          where: { id: input.id },
        });

        // 残高の更新
        await prisma.balance.update({
          where: { userId: logToDelete.userId },
          data: { balance: { decrement: logToDelete.price } },
        });

        return deletedLog;
      });
    }),
});
