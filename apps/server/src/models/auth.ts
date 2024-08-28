import { userTable } from "../db-schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Elysia, Static, t } from "elysia";

export const baseSelectAuthSchema = createSelectSchema(userTable);

export const selectAuthSchema = t.Omit(baseSelectAuthSchema, ["password"]);

export const baseInsertAuthSchema = createInsertSchema(userTable);

export const insertAuthSchema = t.Omit(baseInsertAuthSchema, [
  "id",
  "role",
  "createdAt",
  "updatedAt",
]);

export const tokensAuthSchema = t.Object({
  access: t.String(),
  refresh: t.String(),
});

export const loginParamsSchema = t.Omit(insertAuthSchema, ["email"]);

export const loginDataSchema = t.Object({
  data: selectAuthSchema,
});

export const registerParamsSchema = t.Composite([
  insertAuthSchema,
  t.Object({
    email: t.String({
      format: "email",
    }),
  }),
]);

export const registerDataSchema = t.Object({
  data: selectAuthSchema,
});

export const refreshTokenDataSchema = t.Object({
  data: t.Null(),
});

export const getProfileDataSchema = t.Object({
  data: selectAuthSchema,
});

export type LoginParams = Static<typeof loginParamsSchema>;
export type RegisterParams = Static<typeof registerParamsSchema>;
export type UserData = Static<typeof baseSelectAuthSchema>;
export type AuthData = Static<typeof selectAuthSchema>;
export type TokensData = Static<typeof tokensAuthSchema>;
export type GetProfileParams = { userId: number };

//* Model
export const authModel = new Elysia().model({
  "auth.user": selectAuthSchema,
});
