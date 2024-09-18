import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { ERROR_CODES, GOODS_ISSUE_STATUS_CODE } from "../config/enums";
import {
  goodsIssueDetailTable,
  goodsIssueTable,
  inventoryTable,
} from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateGoodsIssueParams,
  DeleteGoodsIssueParams,
  DeleteMultipleGoodsIssueParams,
  GOODS_ISSUE_RELATION_LIST,
  GetDetailGoodsIssueParams,
  GetListGoodsIssueParams,
  GoodsIssueData,
  UpdateGoodsIssueParams,
} from "../models/goods-issue";
import { ApiError } from "../utils/errors";

export default class GoodsIssueService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db
      .select({ count: count() })
      .from(goodsIssueTable);

    return result[0].count;
  }

  getRelations(includes?: string) {
    if (!includes) return undefined;

    const relations = includes.split(",").map((ele) => ele.trim());

    let relationObj: object | undefined;

    relations.forEach((relation) => {
      const relationType =
        relation as (typeof GOODS_ISSUE_RELATION_LIST)[number];
      if (!GOODS_ISSUE_RELATION_LIST.includes(relationType)) return;

      switch (relationType) {
        case "detail":
          relationObj = { ...(relationObj ?? {}), [relationType]: true };
          break;
        case "detail-product":
          relationObj = {
            ...(relationObj ?? {}),
            ["detail"]: {
              with: {
                ["product"]: true,
              },
            },
          };
          break;
        default:
          break;
      }
    });

    return relationObj;
  }

  async updateInventory(
    goodsIssue: GoodsIssueData,
    items: {
      quantity: number;
      productId: number;
    }[]
  ) {
    const excludedQuantityAvailable = sql.raw(
      `excluded.${inventoryTable.quantityAvailable.name}`
    );

    await this.db
      .insert(inventoryTable)
      .values(
        items.map((item) => ({
          productId: item.productId,
          quantityAvailable: item.quantity,
          warehouseId: goodsIssue.warehouseId,
        }))
      )
      .onConflictDoUpdate({
        target: [inventoryTable.productId, inventoryTable.warehouseId],
        set: {
          quantityAvailable: sql`${inventoryTable.quantityAvailable} - ${excludedQuantityAvailable}`,
        },
      });
  }

  async getListPagePagination(params: GetListGoodsIssueParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, includes } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    const relations = this.getRelations(includes);

    //* Queries
    const goodsIssueList = await this.db.query.goodsIssueTable.findMany({
      where: and(...filters),
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortOrder === "asc"
          ? asc(goodsIssueTable[sortBy ?? "createdAt"])
          : desc(goodsIssueTable[sortBy ?? "createdAt"]),

      with: relations,
    });

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(goodsIssueTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      goodsIssues: goodsIssueList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListGoodsIssueParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      offset = 0,
      name,

      includes,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    const relations = this.getRelations(includes);

    //* Queries
    const goodsIssueList = await this.db.query.goodsIssueTable.findMany({
      where: and(...filters),
      limit: limit + 1,
      offset: offset,
      orderBy:
        sortOrder === "asc"
          ? asc(goodsIssueTable[sortBy ?? "createdAt"])
          : desc(goodsIssueTable[sortBy ?? "createdAt"]),

      with: relations,
    });
    let hasMore = goodsIssueList.length > limit;

    //* Results

    return {
      goodsIssues: goodsIssueList.slice(0, limit),
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailGoodsIssueParams) {
    const { id, includes } = params;

    const relations = this.getRelations(includes);

    return await this.db.query.goodsIssueTable.findFirst({
      where: eq(goodsIssueTable.id, id),
      with: relations,
    });
  }

  async create(params: WithAuthenParams<CreateGoodsIssueParams>) {
    const { userId, detail, ...body } = params;

    const results = await this.db
      .insert(goodsIssueTable)
      .values({
        ...body,
        createdByUserId: userId,
        updatedByUserId: userId,
      })
      .returning();

    const newRecord = results[0];

    await this.db.insert(goodsIssueDetailTable).values(
      detail.map((item) => ({
        ...item,
        goodsIssueId: newRecord.id,
      }))
    );

    if (newRecord.status === GOODS_ISSUE_STATUS_CODE.APPROVED) {
      await this.updateInventory(newRecord, detail);
    }

    return newRecord;
  }

  async update(params: WithAuthenParams<UpdateGoodsIssueParams>) {
    const { id, userId, detail, ...rest } = params;

    const record = await this.db.query.goodsIssueTable.findFirst({
      where: eq(goodsIssueTable.id, id),
      with: {
        detail: true,
      },
    });

    if (!record) {
      throw new ApiError({
        status: "404",
        errorCode: ERROR_CODES.NOT_FOUND_DATA,
        title: ERROR_CODES.NOT_FOUND_DATA,
        messageCode: "not_found_data",
      });
    }

    if (
      record.status === GOODS_ISSUE_STATUS_CODE.APPROVED ||
      record.status === GOODS_ISSUE_STATUS_CODE.REJECTED
    ) {
      throw new ApiError({
        status: "400",
        errorCode: ERROR_CODES.GOODS_ISSUE_STATUS_CODE_APPROVED_REJECTED,
        title: ERROR_CODES.GOODS_ISSUE_STATUS_CODE_APPROVED_REJECTED,
        messageCode: "goods_issue_status_code_approved_rejected",
      });
    }

    const results = await this.db
      .update(goodsIssueTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
        updatedByUserId: userId,
      })
      .where(eq(goodsIssueTable.id, id))
      .returning();

    const newRecord = results[0];

    if (detail && detail.length > 0) {
      await this.db
        .insert(goodsIssueDetailTable)
        .values(
          detail.map((item) => ({
            ...item,
            goodsIssueId: record.id,
          }))
        )
        .onConflictDoUpdate({
          target: [
            goodsIssueDetailTable.goodsIssueId,
            goodsIssueDetailTable.productId,
          ],
          set: {
            quantity: sql.raw(
              `excluded.${goodsIssueDetailTable.quantity.name}`
            ),
          },
        });
    }

    if (newRecord.status === GOODS_ISSUE_STATUS_CODE.APPROVED) {
      if (!detail) {
        await this.updateInventory(newRecord, record.detail);
      } else {
        await this.updateInventory(newRecord, detail);
      }
    }

    return newRecord;
  }

  async delete(params: DeleteGoodsIssueParams) {
    const { id } = params;

    const results = await this.db
      .delete(goodsIssueTable)
      .where(eq(goodsIssueTable.id, id))
      .returning({ id: goodsIssueTable.id });

    return results[0];
  }

  async multipleDelete(params: DeleteMultipleGoodsIssueParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(goodsIssueTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(goodsIssueTable)
      .where(or(...filters))
      .returning({ id: goodsIssueTable.id });

    return result;
  }
}
