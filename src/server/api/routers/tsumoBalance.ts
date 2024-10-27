import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

// Procedureの定義//////////////////////////////////////////////

export const tsumoBalanceRouter = createTRPCRouter({
  // つも残高の取得
  read: protectedProcedure.query(({ ctx }) => {
    return db.tsumoBalance.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),

  // つも残高の更新
  update: protectedProcedure
    .input(z.object({ tsumo: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return db.tsumoBalance.update({
        where: { userId: ctx.session.user.id },
        data: { tsumoBalance: { increment: input.tsumo } },
      });
    }),
});
