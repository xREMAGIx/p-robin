import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { warehouseTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectWarehouseSchema = createSelectSchema(warehouseTable);

export const baseInsertWarehouseSchema = createInsertSchema(warehouseTable);

export const listWarehouseQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
  }),
]);

export const listWarehousePagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectWarehouseSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listWarehouseOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectWarehouseSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailWarehouseDataSchema = t.Object({
  data: baseSelectWarehouseSchema,
});

export const createWarehouseParamSchema = t.Composite([
  t.Omit(baseInsertWarehouseSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateWarehouseParamSchema = t.Composite([
  t.Omit(baseInsertWarehouseSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteWarehouseDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteWarehouseParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteWarehouseDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type WarehouseData = Static<typeof baseSelectWarehouseSchema>;

export type WarehouseListPagePaginationData = Static<
  typeof listWarehousePagePaginationDataSchema
>;

export type GetListWarehouseParams = Static<typeof listWarehouseQuerySchema> & {
  sortBy?: keyof WarehouseData;
};

export type GetDetailWarehouseParams = {
  id: number;
};

export type CreateWarehouseParams = Static<typeof createWarehouseParamSchema>;
export type UpdateWarehouseParams = Static<
  typeof updateWarehouseParamSchema
> & {
  id: number;
};
export type DeleteWarehouseParams = {
  id: number;
};
export type DeleteMultipleWarehouseParams = Static<
  typeof multipleDeleteWarehouseParamSchema
>;

//* Model
export const warehouseModel = new Elysia({ name: "warehouse-model" }).model({
  "warehouse.data": baseSelectWarehouseSchema,
});
