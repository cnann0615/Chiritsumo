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
  read: protectedProcedure.query(({ ctx }) => {
    return db.tsumoBalance.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),

  add: protectedProcedure
    .input(z.object({ tsumo: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return db.tsumoBalance.update({
        where: { userId: ctx.session.user.id },
        data: { tsumoBalance: { increment: input.tsumo } },
      });
    }),

  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });

  //   return post ?? null;
  // }),
});
