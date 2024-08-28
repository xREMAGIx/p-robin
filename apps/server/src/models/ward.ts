import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { wardTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectWardSchema = createSelectSchema(wardTable);

export const baseInsertWardSchema = createInsertSchema(wardTable);

export const listWardQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
    districtCode: t.Optional(t.String()),
  }),
]);

export const listWardPagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectWardSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listWardOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectWardSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailWardDataSchema = t.Object({
  data: baseSelectWardSchema,
});

export const createWardParamSchema = t.Composite([
  t.Omit(baseInsertWardSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateWardParamSchema = t.Composite([
  t.Omit(baseInsertWardSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteWardDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export type WardData = Static<typeof baseSelectWardSchema>;

export type WardListPagePaginationData = Static<
  typeof listWardPagePaginationDataSchema
>;

export type GetListWardParams = Static<typeof listWardQuerySchema> & {
  sortBy?: keyof WardData;
};

export type GetDetailWardParams = {
  id: number;
};

export type CreateWardParams = Static<typeof createWardParamSchema>;
export type UpdateWardParams = Static<typeof updateWardParamSchema> & {
  id: number;
};
export type DeleteWardParams = {
  id: number;
};

//* Model
export const wardModel = new Elysia({ name: "ward-model" }).model({
  "ward.data": baseSelectWardSchema,
});
