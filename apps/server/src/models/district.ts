import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { districtTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectDistrictSchema = createSelectSchema(districtTable);

export const baseInsertDistrictSchema = createInsertSchema(districtTable);

export const listDistrictQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
    provinceCode: t.Optional(t.String()),
  }),
]);

export const listDistrictPagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectDistrictSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listDistrictOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectDistrictSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailDistrictDataSchema = t.Object({
  data: baseSelectDistrictSchema,
});

export const createDistrictParamSchema = t.Composite([
  t.Omit(baseInsertDistrictSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateDistrictParamSchema = t.Composite([
  t.Omit(baseInsertDistrictSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteDistrictDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export type DistrictData = Static<typeof baseSelectDistrictSchema>;

export type DistrictListPagePaginationData = Static<
  typeof listDistrictPagePaginationDataSchema
>;

export type GetListDistrictParams = Static<typeof listDistrictQuerySchema> & {
  sortBy?: keyof DistrictData;
};

export type GetDetailDistrictParams = {
  id: number;
};

export type CreateDistrictParams = Static<typeof createDistrictParamSchema>;
export type UpdateDistrictParams = Static<typeof updateDistrictParamSchema> & {
  id: number;
};
export type DeleteDistrictParams = {
  id: number;
};

//* Model
export const districtModel = new Elysia({ name: "district-model" }).model({
  "district.data": baseSelectDistrictSchema,
});
