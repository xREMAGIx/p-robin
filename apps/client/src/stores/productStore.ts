import { DEFAULT_PAGINATION } from "@config/constants";
import { server } from "@config/server";
import { createFetcherStore } from "./fetcher";

type ProductListType = Awaited<ReturnType<typeof listFetch>>;
type ProductDetailType = Awaited<ReturnType<typeof detailFetch>>;

const listFetch = async (params: PaginationParams) => {
  const { data } = await server.api.products["offset-pagination"].get({
    query: {
      limit: params.limit,
      offset: params.offset,
    },
  });

  return data;
};

const detailFetch = async (params: { id: string | number }) => {
  const { data, error } = await server.api.products({ id: params.id }).get();

  if (error) {
    throw error;
  }

  return data;
};

export const $getProductList =
  (params: { limit: number; offset: number }) => () =>
    createFetcherStore<ProductListType>(
      [`/api/products/`, params.offset, params.limit],
      {
        fetcher: (...keys: (string | number | boolean)[]) => {
          const offset = Number(keys[1] ?? DEFAULT_PAGINATION.OFFSET);
          const limit = Number(keys[2] ?? DEFAULT_PAGINATION.LIMIT);

          return listFetch({ offset, limit });
        },
      }
    );

export const $getProductDetail = (params: { id: string | number }) => () =>
  createFetcherStore<ProductDetailType>([`/api/products/`, params.id], {
    fetcher: (...keys: (string | number | boolean)[]) => {
      const id = Number(keys[1]);

      return detailFetch({ id });
    },
  });
