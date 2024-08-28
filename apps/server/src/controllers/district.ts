import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  DistrictData,
  createDistrictParamSchema,
  deleteDistrictDataSchema,
  detailDistrictDataSchema,
  districtModel,
  listDistrictOffsetPaginationDataSchema,
  listDistrictPagePaginationDataSchema,
  listDistrictQuerySchema,
  updateDistrictParamSchema,
} from "../models/district";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const districtRoutes = new Elysia({
  name: "district-controller",
}).group(
  `api/districts`,
  {
    detail: {
      tags: ["District"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(districtModel)
      //* List
      .get(
        "/page-pagination",
        async ({
          query: {
            sortBy: sortByParams,
            sortOrder = "desc",
            limit = 10,
            page = 1,
            ...rest
          },
          districtService,
        }) => {
          const sortBy = sortByParams as keyof DistrictData;
          const sortByList: (keyof DistrictData)[] = [
            "name",
            "createdAt",
            "updatedAt",
          ];
          if (sortBy && !sortByList.includes(sortBy)) {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              messageCode: "invalid_sort_by",
            });
          }

          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              messageCode: "invalid_sort_order",
            });
          }

          const res = await districtService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.districts,
            meta: res.meta,
          };
        },
        {
          query: listDistrictQuerySchema,
          response: {
            200: listDistrictPagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get District List (page pagination)",
          },
        }
      )
      .get(
        "/offset-pagination",
        async ({
          query: {
            sortBy: sortByParams,
            sortOrder = "desc",
            limit = 10,
            offset = 0,
            ...rest
          },
          districtService,
        }) => {
          const sortBy = sortByParams as keyof DistrictData;
          const sortByList: (keyof DistrictData)[] = [
            "name",
            "createdAt",
            "updatedAt",
          ];
          if (sortBy && !sortByList.includes(sortBy)) {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              messageCode: "invalid_sort_by",
            });
          }

          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              messageCode: "invalid_sort_order",
            });
          }

          const res = await districtService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.districts,
            meta: res.meta,
          };
        },
        {
          query: listDistrictQuerySchema,
          response: {
            200: listDistrictOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get District List (offset pagination)",
          },
        }
      )
      //* Create
      .guard((innerApp) =>
        innerApp.use(authenticatePlugin).post(
          "/create",
          async ({ body, userId, districtService }) => {
            const data = await districtService.create({ ...body, userId });

            return {
              data: data,
            };
          },
          {
            body: createDistrictParamSchema,
            response: {
              200: detailDistrictDataSchema,
              401: apiErrorSchema,
              422: apiErrorSchema,
              500: apiErrorSchema,
            },
            detail: {
              summary: "Create District",
            },
          }
        )
      )

      .use(idValidatePlugin)
      //* Get detail
      .get(
        "/:id",
        async ({ idParams, districtService }) => {
          const data = await districtService.getDetail({ id: idParams });

          if (!data) {
            throw new ApiError({
              status: "404",
              errorCode: ERROR_CODES.NOT_FOUND_DATA,
              title: ERROR_CODES.NOT_FOUND_DATA,
              messageCode: "not_found_data",
            });
          }

          return {
            data,
          };
        },
        {
          response: {
            200: detailDistrictDataSchema,
            401: apiErrorSchema,
            404: apiErrorSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get District Detail",
          },
        }
      )
      .use(authenticatePlugin)
      //* Update
      .put(
        "/:id",
        async ({ idParams, body, userId, districtService }) => {
          const data = await districtService.update({
            ...body,
            userId,
            id: idParams,
          });

          return {
            data,
          };
        },
        {
          body: updateDistrictParamSchema,
          response: {
            200: detailDistrictDataSchema,
            401: apiErrorSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Update District",
          },
        }
      )
      //* Delete
      .delete(
        "/:id",
        async ({ idParams, districtService }) => {
          const res = await districtService.delete({ id: idParams });

          return { data: res };
        },
        {
          response: {
            200: deleteDistrictDataSchema,
            401: apiErrorSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Delete District",
          },
        }
      )
);
