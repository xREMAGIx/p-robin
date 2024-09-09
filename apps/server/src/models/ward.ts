import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { districtTable, provinceTable, wardTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectWardSchema = createSelectSchema(wardTable);
const baseSelectDistrictSchema = createSelectSchema(districtTable);
const baseSelectProvinceSchema = createSelectSchema(provinceTable);

export const baseInsertWardSchema = createInsertSchema(wardTable);

export const listWardQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
    districtCode: t.Optional(t.String()),
    includes: t.Optional(
      t.String({
        description: "district | province",
      })
    ),
  }),
]);

export const wardDataSchema = t.Composite([
  baseSelectWardSchema,
  t.Object({
    district: t.Optional(t.Nullable(baseSelectDistrictSchema)),
    province: t.Optional(t.Nullable(baseSelectProvinceSchema)),
  }),
]);

export const listWardPagePaginationDataSchema = t.Object({
  data: t.Array(wardDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listWardOffsetPaginationDataSchema = t.Object({
  data: t.Array(wardDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailWardQueryParamSchema = t.Object({
  includes: t.Optional(
    t.String({
      description: "district",
    })
  ),
});

export const detailWardDataSchema = t.Object({
  data: wardDataSchema,
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

export const multipleDeleteWardParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteWardDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
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
} & Static<typeof detailWardQueryParamSchema>;

export type CreateWardParams = Static<typeof createWardParamSchema>;
export type UpdateWardParams = Static<typeof updateWardParamSchema> & {
  id: number;
};
export type DeleteWardParams = {
  id: number;
};
export type DeleteMultipleWardParams = Static<
  typeof multipleDeleteWardParamSchema
>;
//* Model
export const wardModel = new Elysia({ name: "ward-model" }).model({
  "ward.data": baseSelectWardSchema,
});
