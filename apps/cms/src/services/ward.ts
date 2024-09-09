import { server } from "@cms/config/server";

export type WardListOffsetPaginationType = NonNullable<
  Awaited<ReturnType<typeof wardListOffsetPaginationFetch>>["data"]
>;
export type WardDetailType = NonNullable<
  Awaited<ReturnType<typeof wardDetailFetch>>["data"]
>;

export type WardCreateParams = NonNullable<
  Parameters<(typeof server.api)["wards"]["create"]["post"]>
>[0];

export type WardUpdateParams = DetailParams & WardCreateParams;

export const wardListPagePaginationFetch = async (
  params: Omit<ListParams, "offset">
) => {
  return await server.api["wards"]["page-pagination"].get({
    query: {
      ...params,
    },
  });
};

export const wardListOffsetPaginationFetch = async (
  params: Omit<ListParams, "page">
) => {
  return await server.api["wards"]["offset-pagination"].get({
    query: {
      ...params,
    },
  });
};

export const wardDetailFetch = async (params: DetailParams) => {
  const { id, includes } = params;
  return await server.api["wards"]({ id }).get({
    query: { includes },
  });
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
