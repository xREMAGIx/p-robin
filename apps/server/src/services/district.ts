import { SQLWrapper, and, asc, count, desc, eq, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { districtTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateDistrictParams,
  DeleteDistrictParams,
  GetDetailDistrictParams,
  GetListDistrictParams,
  UpdateDistrictParams,
} from "../models/district";

export default class DistrictService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(districtTable);

    return result[0].count;
  }

  async getListPagePagination(params: GetListDistrictParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      page = 1,
      name,
      provinceCode,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${districtTable.name}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );
    if (provinceCode)
      filters.push(eq(districtTable.provinceCode, provinceCode));

    //* Queries
    const districtList = await this.db
      .select()
      .from(districtTable)
      .where(and(...filters))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(districtTable[sortBy ?? "createdAt"])
          : desc(districtTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(districtTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      districts: districtList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListDistrictParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      offset = 0,
      name,
      provinceCode,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${districtTable.name}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );
    if (provinceCode)
      filters.push(eq(districtTable.provinceCode, provinceCode));

    //* Queries
    const districtList = await this.db
      .select()
      .from(districtTable)
      .where(and(...filters))
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(districtTable[sortBy ?? "createdAt"])
          : desc(districtTable[sortBy ?? "createdAt"])
      );

    let hasMore = false;

    if (districtList.length === limit) {
      const totalQueryResult = await this.db
        .select({ count: count() })
        .from(districtTable)
        .where(and(...filters));

      const total = Number(totalQueryResult?.[0]?.count);

      hasMore =
        total > limit * (offset / limit) + districtList.length ? true : false;
    } else {
      hasMore = districtList.length > limit ? true : false;
    }

    //* Results

    return {
      districts: districtList,
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailDistrictParams) {
    const { id } = params;

    return await this.db.query.districtTable.findFirst({
      where: eq(districtTable.id, id),
    });
  }

  async create(params: WithAuthenParams<CreateDistrictParams>) {
    const { userId, ...body } = params;

    const results = await this.db
      .insert(districtTable)
      .values({
        ...body,
      })
      .returning();

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateDistrictParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(districtTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(districtTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteDistrictParams) {
    const { id } = params;

    const results = await this.db
      .delete(districtTable)
      .where(eq(districtTable.id, id))
      .returning({ id: districtTable.id });

    return results[0];
  }
}
