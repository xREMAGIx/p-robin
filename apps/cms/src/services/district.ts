import { server } from "@cms/config/server";

export type DistrictListPagePaginationParams = NonNullable<
  Parameters<(typeof server.api)["districts"]["page-pagination"]["get"]>
>[0];

export type DistrictListOffsetPaginationParams = NonNullable<
  Parameters<(typeof server.api)["districts"]["offset-pagination"]["get"]>
>[0];

export type DistrictCreateParams = NonNullable<
  Parameters<(typeof server.api)["districts"]["create"]["post"]>
>[0];

export type DistrictIdPathParams = NonNullable<
  Parameters<(typeof server.api)["districts"]>
>[0];

export type DistrictDetailParams = DistrictIdPathParams &
  Parameters<
    NonNullable<ReturnType<(typeof server.api)["districts"]>>["get"]
  >[0];

export type DistrictUpdateParams = DistrictIdPathParams & DistrictCreateParams;

export type DistrictDeleteParams = DistrictIdPathParams;

export type DistrictMultipleDeleteParams = NonNullable<
  Parameters<(typeof server.api)["districts"]["multiple-delete"]["delete"]>
>[0];

export type DistrictListOffsetPaginationType = NonNullable<
  Awaited<ReturnType<typeof districtListOffsetPaginationFetch>>["data"]
>;
export type DistrictDetailType = NonNullable<
  Awaited<ReturnType<typeof districtDetailFetch>>["data"]
>;

export const districtListPagePaginationFetch = async (
  params: DistrictListPagePaginationParams
) => {
  return await server.api["districts"]["page-pagination"].get(params);
};

export const districtListOffsetPaginationFetch = async (
  params: DistrictListOffsetPaginationParams
) => {
  return await server.api["districts"]["offset-pagination"].get(params);
};

export const districtDetailFetch = async (params: DistrictDetailParams) => {
  const { id, ...restParams } = params;
  return await server.api["districts"]({ id }).get(restParams);
};

export const districtCreate = async (params: DistrictCreateParams) => {
  return await server.api["districts"].create.post(params);
};

export const districtUpdate = async (params: DistrictUpdateParams) => {
  const { id, ...restParams } = params;
  return await server.api["districts"]({ id }).put({
    ...restParams,
  });
};

export const districtDelete = async (params: DistrictDeleteParams) => {
  const { id } = params;
  return await server.api["districts"]({ id }).delete();
};

export const districtMultipleDelete = async (
  params: DistrictMultipleDeleteParams
) => {
  const { ids } = params;
  return await server.api["districts"]["multiple-delete"].delete({ ids });
};
