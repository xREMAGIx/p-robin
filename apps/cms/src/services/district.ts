import { server } from "@cms/config/server";

export type DistrictListOffsetPaginationType = NonNullable<
  Awaited<ReturnType<typeof districtListOffsetPaginationFetch>>["data"]
>;
export type DistrictDetailType = NonNullable<
  Awaited<ReturnType<typeof districtDetailFetch>>["data"]
>;

export const districtListOffsetPaginationFetch = async (params: ListParams) => {
  return await server.api["districts"]["offset-pagination"].get({
    query: {
      ...params,
    },
  });
};

export const districtDetailFetch = async (params: DetailParams) => {
  return await server.api["districts"]({ id: params.id }).get({
    query: {},
  });
};
