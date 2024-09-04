import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { provinceTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectProvinceSchema = createSelectSchema(provinceTable);

export const baseInsertProvinceSchema = createInsertSchema(provinceTable);

export const listProvinceQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
  }),
]);

export const listProvincePagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectProvinceSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listProvinceOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectProvinceSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailProvinceDataSchema = t.Object({
  data: baseSelectProvinceSchema,
});

export const createProvinceParamSchema = t.Composite([
  t.Omit(baseInsertProvinceSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateProvinceParamSchema = t.Composite([
  t.Omit(baseInsertProvinceSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteProvinceDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteProvinceParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteProvinceDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type ProvinceData = Static<typeof baseSelectProvinceSchema>;

export type ProvinceListPagePaginationData = Static<
  typeof listProvincePagePaginationDataSchema
>;

export type GetListProvinceParams = Static<typeof listProvinceQuerySchema> & {
  sortBy?: keyof ProvinceData;
};

export type GetDetailProvinceParams = {
  id: number;
};

export type CreateProvinceParams = Static<typeof createProvinceParamSchema>;
export type UpdateProvinceParams = Static<typeof updateProvinceParamSchema> & {
  id: number;
};
export type DeleteProvinceParams = {
  id: number;
};
export type DeleteMultipleProvinceParams = Static<
  typeof multipleDeleteProvinceParamSchema
>;

//* Model
export const provinceModel = new Elysia({ name: "province-model" }).model({
  "province.data": baseSelectProvinceSchema,
});
