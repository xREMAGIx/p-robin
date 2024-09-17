import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { goodsIssueDetailTable, goodsIssueTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateGoodsIssueParams,
  DeleteGoodsIssueParams,
  DeleteMultipleGoodsIssueParams,
  GOODS_ISSUE_RELATION_LIST,
  GetDetailGoodsIssueParams,
  GetListGoodsIssueParams,
  UpdateGoodsIssueParams,
} from "../models/goods-issue";

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

        default:
          break;
      }
    });

    return relationObj;
  }

  async getListPagePagination(params: GetListGoodsIssueParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      page = 1,
      name,

      includes,
    } = params;

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
    const {
      id,

      includes,
    } = params;

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

    await this.db.insert(goodsIssueDetailTable).values(
      detail.map((item) => ({
        ...item,
        goodsIssueId: results[0].id,
      }))
    );

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateGoodsIssueParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(goodsIssueTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
        updatedByUserId: userId,
      })
      .where(eq(goodsIssueTable.id, id))
      .returning();

    return results[0];
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
