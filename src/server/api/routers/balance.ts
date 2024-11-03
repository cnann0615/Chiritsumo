import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

// Procedureの定義//////////////////////////////////////////////

export const balanceRouter = createTRPCRouter({
  // 残高の取得
  read: protectedProcedure.query(({ ctx }) => {
    return db.balance.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),

  // 残高の更新
  update: protectedProcedure
    .input(z.object({ balance: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return db.balance.update({
        where: { userId: ctx.session.user.id },
        data: { balance: { increment: input.balance } },
      });
    }),
});
