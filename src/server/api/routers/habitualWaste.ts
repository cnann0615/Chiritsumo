import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

// Procedureの定義//////////////////////////////////////////////

export const habitualWasteRouter = createTRPCRouter({
  // 習慣的な無駄遣いを取得
  read: protectedProcedure.query(({ ctx }) => {
    return db.habitualWaste.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // 習慣的な無駄遣いを追加
  create: protectedProcedure
    .input(z.object({ tsumo: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.habitualWaste.create({
        data: {
          userId: ctx.session.user.id,
          tsumo: input.tsumo,
          title: input.title,
        },
      });
    }),

  // 習慣的な無駄遣いの更新
  update: protectedProcedure
    .input(z.object({ id: z.string(), tsumo: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.habitualWaste.update({
        where: { id: input.id },
        data: {
          tsumo: input.tsumo,
          title: input.title,
        },
      });
    }),

  // 習慣的な無駄遣いの削除
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.habitualWaste.delete({
        where: { id: input.id },
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
