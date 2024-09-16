import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { inventoryTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectInventorySchema = createSelectSchema(inventoryTable);

export const baseInsertInventorySchema = createInsertSchema(inventoryTable);

export const listInventoryQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    warehouseId: t.Optional(t.Numeric()),
    productId: t.Optional(t.Numeric()),
  }),
]);

export const listInventoryPagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectInventorySchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listInventoryOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectInventorySchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailInventoryDataSchema = t.Object({
  data: baseSelectInventorySchema,
});

export const createInventoryParamSchema = t.Composite([
  t.Omit(baseInsertInventorySchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateInventoryParamSchema = t.Composite([
  t.Omit(baseInsertInventorySchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteInventoryDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteInventoryParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteInventoryDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type InventoryData = Static<typeof baseSelectInventorySchema>;

export type InventoryListPagePaginationData = Static<
  typeof listInventoryPagePaginationDataSchema
>;

export type GetListInventoryParams = Static<typeof listInventoryQuerySchema> & {
  sortBy?: keyof InventoryData;
};

export type GetDetailInventoryParams = {
  id: number;
};

export type CreateInventoryParams = Static<typeof createInventoryParamSchema>;
export type UpdateInventoryParams = Static<
  typeof updateInventoryParamSchema
> & {
  id: number;
};
export type DeleteInventoryParams = {
  id: number;
};
export type DeleteMultipleInventoryParams = Static<
  typeof multipleDeleteInventoryParamSchema
>;

//* Model
export const inventoryModel = new Elysia({ name: "inventory-model" }).model({
  "inventory.data": baseSelectInventorySchema,
});
