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

  // ログの追加
  create: protectedProcedure
    .input(z.object({ price: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.log.create({
        data: {
          userId: ctx.session.user.id,
          price: input.price,
          title: input.title,
        },
      });
    }),

  // ログの更新
  update: protectedProcedure
    .input(z.object({ id: z.string(), price: z.number(), title: z.string() }))
    .mutation(async ({ input }) => {
      return db.log.update({
        where: { id: input.id },
        data: {
          price: input.price,
          title: input.title,
        },
      });
    }),

  // ログの削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.log.delete({
        where: { id: input.id },
      });
    }),
});
