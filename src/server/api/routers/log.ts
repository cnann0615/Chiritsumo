import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

// Procedureの定義//////////////////////////////////////////////

export const logRouter = createTRPCRouter({
  // つもログの取得
  read: protectedProcedure.query(({ ctx }) => {
    return db.log.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // つもログの追加
  create: protectedProcedure
    .input(z.object({ balance: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.log.create({
        data: {
          userId: ctx.session.user.id,
          balance: input.balance,
          title: input.title,
        },
      });
    }),

  // つもログの更新
  update: protectedProcedure
    .input(z.object({ id: z.string(), balance: z.number(), title: z.string() }))
    .mutation(async ({ input }) => {
      return db.log.update({
        where: { id: input.id },
        data: {
          balance: input.balance,
          title: input.title,
        },
      });
    }),

  // つもログの削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.log.delete({
        where: { id: input.id },
      });
    }),
});
