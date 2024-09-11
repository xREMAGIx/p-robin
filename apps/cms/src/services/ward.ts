import { server } from "@cms/config/server";

export type WardListPagePaginationParams = NonNullable<
  Parameters<(typeof server.api)["wards"]["page-pagination"]["get"]>
>[0];

export type WardListOffsetPaginationParams = NonNullable<
  Parameters<(typeof server.api)["wards"]["offset-pagination"]["get"]>
>[0];

export type WardCreateParams = NonNullable<
  Parameters<(typeof server.api)["wards"]["create"]["post"]>
>[0];

export type WardIdPathParams = NonNullable<
  Parameters<(typeof server.api)["wards"]>
>[0];

export type WardDetailParams = WardIdPathParams &
  Parameters<NonNullable<ReturnType<(typeof server.api)["wards"]>>["get"]>[0];

export type WardUpdateParams = WardIdPathParams & WardCreateParams;

export type WardDeleteParams = WardIdPathParams;

export type WardMultipleDeleteParams = NonNullable<
  Parameters<(typeof server.api)["wards"]["multiple-delete"]["delete"]>
>[0];

export type WardListOffsetPaginationType = NonNullable<
  Awaited<ReturnType<typeof wardListOffsetPaginationFetch>>["data"]
>;
export type WardDetailType = NonNullable<
  Awaited<ReturnType<typeof wardDetailFetch>>["data"]
>;

export const wardListPagePaginationFetch = async (
  params: WardListPagePaginationParams
) => {
  return await server.api["wards"]["page-pagination"].get(params);
};

export const wardListOffsetPaginationFetch = async (
  params: WardListOffsetPaginationParams
) => {
  return await server.api["wards"]["offset-pagination"].get(params);
};

export const wardDetailFetch = async (params: WardDetailParams) => {
  const { id, ...restParams } = params;
  return await server.api["wards"]({ id }).get(restParams);
};

export const wardCreate = async (params: WardCreateParams) => {
  return await server.api["wards"].create.post(params);
};

export const wardUpdate = async (params: WardUpdateParams) => {
  const { id, ...restParams } = params;
  return await server.api["wards"]({ id }).put({
    ...restParams,
  });
};

export const wardDelete = async (params: WardDeleteParams) => {
  const { id } = params;
  return await server.api["wards"]({ id }).delete();
};

export const wardMultipleDelete = async (params: WardMultipleDeleteParams) => {
  const { ids } = params;
  return await server.api["wards"]["multiple-delete"].delete({ ids });
};
