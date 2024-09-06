import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { districtTable, provinceTable, wardTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectDistrictSchema = createSelectSchema(districtTable);
const baseSelectProvinceSchema = createSelectSchema(provinceTable);
const baseSelectWardSchema = createSelectSchema(wardTable);

export const baseInsertDistrictSchema = createInsertSchema(districtTable);

export const listDistrictQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
    provinceCode: t.Optional(t.String()),
    includes: t.Optional(
      t.String({
        description: "province | wards",
      })
    ),
  }),
]);

export const districtDataSchema = t.Composite([
  baseSelectDistrictSchema,
  t.Object({
    province: t.Optional(t.Nullable(baseSelectProvinceSchema)),
    wards: t.Optional(t.Array(baseSelectWardSchema)),
  }),
]);

export const listDistrictPagePaginationDataSchema = t.Object({
  data: t.Array(districtDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listDistrictOffsetPaginationDataSchema = t.Object({
  data: t.Array(districtDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailDistrictQueryParamSchema = t.Object({
  includes: t.Optional(
    t.String({
      description: "province | wards",
    })
  ),
});

export const detailDistrictDataSchema = t.Object({
  data: districtDataSchema,
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

export const multipleDeleteDistrictParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteDistrictDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
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
} & Static<typeof detailDistrictQueryParamSchema>;

export type CreateDistrictParams = Static<typeof createDistrictParamSchema>;
export type UpdateDistrictParams = Static<typeof updateDistrictParamSchema> & {
  id: number;
};
export type DeleteDistrictParams = {
  id: number;
};
export type DeleteMultipleDistrictParams = Static<
  typeof multipleDeleteDistrictParamSchema
>;

//* Model
export const districtModel = new Elysia({ name: "district-model" }).model({
  "district.data": baseSelectDistrictSchema,
});
