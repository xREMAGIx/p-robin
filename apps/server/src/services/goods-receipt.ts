import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { goodsReceiptDetailTable, goodsReceiptTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateGoodsReceiptParams,
  DeleteGoodsReceiptParams,
  DeleteMultipleGoodsReceiptParams,
  GOODS_RECEIPT_RELATION_LIST,
  GetDetailGoodsReceiptParams,
  GetListGoodsReceiptParams,
  UpdateGoodsReceiptParams,
} from "../models/goods-receipt";

export default class GoodsReceiptService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db
      .select({ count: count() })
      .from(goodsReceiptTable);

    return result[0].count;
  }

  getRelations(includes?: string) {
    if (!includes) return undefined;

    const relations = includes.split(",").map((ele) => ele.trim());

    let relationObj: object | undefined;

    relations.forEach((relation) => {
      const relationType =
        relation as (typeof GOODS_RECEIPT_RELATION_LIST)[number];
      if (!GOODS_RECEIPT_RELATION_LIST.includes(relationType)) return;

      switch (relationType) {
        case "detail":
          relationObj = { ...(relationObj ?? {}), [relationType]: true };
          break;
        default:
          break;
      }
    });

    return relationObj;
  }

  async getListPagePagination(params: GetListGoodsReceiptParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, includes } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    const relations = this.getRelations(includes);

    //* Queries
    const goodsReceiptList = await this.db.query.goodsReceiptTable.findMany({
      where: and(...filters),
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortOrder === "asc"
          ? asc(goodsReceiptTable[sortBy ?? "createdAt"])
          : desc(goodsReceiptTable[sortBy ?? "createdAt"]),
      with: relations,
    });

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(goodsReceiptTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      goodsReceipts: goodsReceiptList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListGoodsReceiptParams) {
    const { sortBy, sortOrder, limit = 10, offset = 0, includes } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    const relations = this.getRelations(includes);

    //* Queries
    const goodsReceiptList = await this.db.query.goodsReceiptTable.findMany({
      where: and(...filters),
      limit: limit + 1,
      offset: offset,
      orderBy:
        sortOrder === "asc"
          ? asc(goodsReceiptTable[sortBy ?? "createdAt"])
          : desc(goodsReceiptTable[sortBy ?? "createdAt"]),
      with: relations,
    });
    let hasMore = goodsReceiptList.length > limit;

    //* Results

    return {
      goodsReceipts: goodsReceiptList.slice(0, limit),
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailGoodsReceiptParams) {
    const { id, includes } = params;

    const relations = this.getRelations(includes);

    return await this.db.query.goodsReceiptTable.findFirst({
      where: eq(goodsReceiptTable.id, id),
      with: relations,
    });
  }

  async create(params: WithAuthenParams<CreateGoodsReceiptParams>) {
    const { userId, detail, ...body } = params;

    const results = await this.db
      .insert(goodsReceiptTable)
      .values({
        ...body,
        createdByUserId: userId,
        updatedByUserId: userId,
      })
      .returning();

    await this.db.insert(goodsReceiptDetailTable).values(
      detail.map((item) => ({
        ...item,
        goodsReceiptId: results[0].id,
      }))
    );

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateGoodsReceiptParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(goodsReceiptTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
        updatedByUserId: userId,
      })
      .where(eq(goodsReceiptTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteGoodsReceiptParams) {
    const { id } = params;

    const results = await this.db
      .delete(goodsReceiptTable)
      .where(eq(goodsReceiptTable.id, id))
      .returning({ id: goodsReceiptTable.id });

    return results[0];
  }

  async multipleDelete(params: DeleteMultipleGoodsReceiptParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(goodsReceiptTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(goodsReceiptTable)
      .where(or(...filters))
      .returning({ id: goodsReceiptTable.id });

    return result;
  }
}
