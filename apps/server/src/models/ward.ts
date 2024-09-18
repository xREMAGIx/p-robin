import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { districtTable, provinceTable, wardTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectWardSchema = createSelectSchema(wardTable);
const baseSelectDistrictSchema = createSelectSchema(districtTable);
const baseSelectProvinceSchema = createSelectSchema(provinceTable);

export const baseInsertWardSchema = createInsertSchema(wardTable);

export const WARD_RELATION_LIST = ["district", "district-province"] as const;

export const wardRelationSchema = t.Object({
  includes: t.Optional(
    t.String({
      description: `${WARD_RELATION_LIST.join(" | ")} (separate with comma)`,
    })
  ),
});

export const listWardQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
    districtCode: t.Optional(t.String()),
  }),
  wardRelationSchema,
]);

export const wardDataSchema = t.Composite([
  baseSelectWardSchema,
  t.Object({
    district: t.Optional(
      t.Nullable(
        t.Composite([
          baseSelectDistrictSchema,
          t.Object({
            province: t.Optional(t.Nullable(baseSelectProvinceSchema)),
          }),
        ])
      )
    ),
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

export const detailWardQueryParamSchema = t.Composite([wardRelationSchema]);

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
