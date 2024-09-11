import { server } from "@cms/config/server";

export type ProvinceListPagePaginationParams = NonNullable<
  Parameters<(typeof server.api)["provinces"]["page-pagination"]["get"]>
>[0];

export type ProvinceListOffsetPaginationParams = NonNullable<
  Parameters<(typeof server.api)["provinces"]["offset-pagination"]["get"]>
>[0];

export type ProvinceCreateParams = NonNullable<
  Parameters<(typeof server.api)["provinces"]["create"]["post"]>
>[0];

export type ProvinceIdPathParams = NonNullable<
  Parameters<(typeof server.api)["provinces"]>
>[0];

export type ProvinceDetailParams = ProvinceIdPathParams &
  Parameters<
    NonNullable<ReturnType<(typeof server.api)["provinces"]>>["get"]
  >[0];

export type ProvinceUpdateParams = ProvinceIdPathParams & ProvinceCreateParams;

export type ProvinceDeleteParams = ProvinceIdPathParams;

export type ProvinceMultipleDeleteParams = NonNullable<
  Parameters<(typeof server.api)["provinces"]["multiple-delete"]["delete"]>
>[0];

export type ProvinceListOffsetPaginationType = NonNullable<
  Awaited<ReturnType<typeof provinceListOffsetPaginationFetch>>["data"]
>;
export type ProvinceDetailType = NonNullable<
  Awaited<ReturnType<typeof provinceDetailFetch>>["data"]
>;

export const provinceListPagePaginationFetch = async (
  params: ProvinceListPagePaginationParams
) => {
  return await server.api["provinces"]["page-pagination"].get(params);
};

export const provinceListOffsetPaginationFetch = async (
  params: ProvinceListOffsetPaginationParams
) => {
  return await server.api["provinces"]["offset-pagination"].get(params);
};

export const provinceDetailFetch = async (params: ProvinceDetailParams) => {
  const { id, ...restParams } = params;
  return await server.api["provinces"]({ id }).get(restParams);
};

export const provinceCreate = async (params: ProvinceCreateParams) => {
  return await server.api["provinces"].create.post(params);
};

export const provinceUpdate = async (params: ProvinceUpdateParams) => {
  const { id, ...restParams } = params;
  return await server.api["provinces"]({ id }).put({
    ...restParams,
  });
};

export const provinceDelete = async (params: ProvinceDeleteParams) => {
  const { id } = params;
  return await server.api["provinces"]({ id }).delete();
};

export const provinceMultipleDelete = async (
  params: ProvinceMultipleDeleteParams
) => {
  const { ids } = params;
  return await server.api["provinces"]["multiple-delete"].delete({ ids });
};
