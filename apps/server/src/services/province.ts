import { SQLWrapper, and, asc, count, desc, eq, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { provinceTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateProvinceParams,
  DeleteProvinceParams,
  GetDetailProvinceParams,
  GetListProvinceParams,
  UpdateProvinceParams,
} from "../models/province";

export default class ProvinceService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(provinceTable);

    return result[0].count;
  }

  async getListPagePagination(params: GetListProvinceParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, name } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${provinceTable.name}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );

    //* Queries
    const provinceList = await this.db
      .select()
      .from(provinceTable)
      .where(and(...filters))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(provinceTable[sortBy ?? "createdAt"])
          : desc(provinceTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(provinceTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      provinces: provinceList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListProvinceParams) {
    const { sortBy, sortOrder, limit = 10, offset = 0, name } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${provinceTable.name}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );

    //* Queries
    const provinceList = await this.db
      .select()
      .from(provinceTable)
      .where(and(...filters))
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(provinceTable[sortBy ?? "createdAt"])
          : desc(provinceTable[sortBy ?? "createdAt"])
      );

    let hasMore = false;

    if (provinceList.length === limit) {
      const totalQueryResult = await this.db
        .select({ count: count() })
        .from(provinceTable)
        .where(and(...filters));

      const total = Number(totalQueryResult?.[0]?.count);

      hasMore =
        total > limit * (offset / limit) + provinceList.length ? true : false;
    } else {
      hasMore = provinceList.length > limit ? true : false;
    }

    //* Results
    return {
      provinces: provinceList,
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailProvinceParams) {
    const { id } = params;

    return await this.db.query.provinceTable.findFirst({
      where: eq(provinceTable.id, id),
    });
  }

  async create(params: WithAuthenParams<CreateProvinceParams>) {
    const { userId, ...body } = params;

    const results = await this.db
      .insert(provinceTable)
      .values({
        ...body,
      })
      .returning();

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateProvinceParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(provinceTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(provinceTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteProvinceParams) {
    const { id } = params;

    const results = await this.db
      .delete(provinceTable)
      .where(eq(provinceTable.id, id))
      .returning({ id: provinceTable.id });

    return results[0];
  }
}
