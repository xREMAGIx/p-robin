import { server } from "@cms/config/server";

export type WarehouseListPagePaginationParams = NonNullable<
  Parameters<(typeof server.api)["warehouses"]["page-pagination"]["get"]>
>[0];

export type WarehouseListOffsetPaginationParams = NonNullable<
  Parameters<(typeof server.api)["warehouses"]["offset-pagination"]["get"]>
>[0];

export type WarehouseCreateParams = NonNullable<
  Parameters<(typeof server.api)["warehouses"]["create"]["post"]>
>[0];

export type WarehouseIdPathParams = NonNullable<
  Parameters<(typeof server.api)["warehouses"]>
>[0];

export type WarehouseDetailParams = WarehouseIdPathParams &
  Parameters<
    NonNullable<ReturnType<(typeof server.api)["warehouses"]>>["get"]
  >[0];

export type WarehouseUpdateParams = WarehouseIdPathParams &
  WarehouseCreateParams;

export type WarehouseDeleteParams = WarehouseIdPathParams;

export type WarehouseMultipleDeleteParams = NonNullable<
  Parameters<(typeof server.api)["warehouses"]["multiple-delete"]["delete"]>
>[0];

export type WarehouseListOffsetPaginationType = NonNullable<
  Awaited<ReturnType<typeof warehouseListOffsetPaginationFetch>>["data"]
>;
export type WarehouseDetailType = NonNullable<
  Awaited<ReturnType<typeof warehouseDetailFetch>>["data"]
>;

export const warehouseListPagePaginationFetch = async (
  params: WarehouseListPagePaginationParams
) => {
  return await server.api["warehouses"]["page-pagination"].get(params);
};

export const warehouseListOffsetPaginationFetch = async (
  params: WarehouseListOffsetPaginationParams
) => {
  return await server.api["warehouses"]["offset-pagination"].get(params);
};

export const warehouseDetailFetch = async (params: WarehouseDetailParams) => {
  const { id, ...restParams } = params;
  return await server.api["warehouses"]({ id }).get(restParams);
};

export const warehouseCreate = async (params: WarehouseCreateParams) => {
  return await server.api["warehouses"].create.post(params);
};

export const warehouseUpdate = async (params: WarehouseUpdateParams) => {
  const { id, ...restParams } = params;
  return await server.api["warehouses"]({ id }).put({
    ...restParams,
  });
};

export const warehouseDelete = async (params: WarehouseDeleteParams) => {
  const { id } = params;
  return await server.api["warehouses"]({ id }).delete();
};

export const warehouseMultipleDelete = async (
  params: WarehouseMultipleDeleteParams
) => {
  const { ids } = params;
  return await server.api["warehouses"]["multiple-delete"].delete({ ids });
};
