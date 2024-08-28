import {
  SQLWrapper,
  and,
  asc,
  count,
  desc,
  eq,
  like,
  or,
  sql,
} from "drizzle-orm";
import { DBType } from "../config/database";
import { wardTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateWardParams,
  DeleteWardParams,
  GetDetailWardParams,
  GetListWardParams,
  UpdateWardParams,
} from "../models/ward";

export default class WardService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(wardTable);

    return result[0].count;
  }

  async getListPagePagination(params: GetListWardParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      page = 1,
      name,
      districtCode,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${wardTable.name}) ilike unaccent('%${sql.raw(name)}%')`
      );
    if (districtCode) filters.push(eq(wardTable.districtCode, districtCode));

    //* Queries
    const wardList = await this.db
      .select()
      .from(wardTable)
      .where(and(...filters))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(wardTable[sortBy ?? "createdAt"])
          : desc(wardTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(wardTable)
      .where(or(name ? like(wardTable.name, `%${name}%`) : undefined));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      wards: wardList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListWardParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      offset = 0,
      name,
      districtCode,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${wardTable.name}) ilike unaccent('%${sql.raw(name)}%')`
      );
    if (districtCode) filters.push(eq(wardTable.districtCode, districtCode));

    //* Queries
    const wardList = await this.db
      .select()
      .from(wardTable)
      .where(and(...filters))
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(wardTable[sortBy ?? "createdAt"])
          : desc(wardTable[sortBy ?? "createdAt"])
      );

    let hasMore = false;

    if (wardList.length === limit) {
      const totalQueryResult = await this.db
        .select({ count: count() })
        .from(wardTable)
        .where(and(...filters));

      const total = Number(totalQueryResult?.[0]?.count);

      hasMore =
        total > limit * (offset / limit) + wardList.length ? true : false;
    } else {
      hasMore = wardList.length > limit ? true : false;
    }

    //* Results
    return {
      wards: wardList,
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailWardParams) {
    const { id } = params;

    return await this.db.query.wardTable.findFirst({
      where: eq(wardTable.id, id),
    });
  }

  async create(params: WithAuthenParams<CreateWardParams>) {
    const { userId, ...body } = params;

    const results = await this.db
      .insert(wardTable)
      .values({
        ...body,
      })
      .returning();

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateWardParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(wardTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(wardTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteWardParams) {
    const { id } = params;

    const results = await this.db
      .delete(wardTable)
      .where(eq(wardTable.id, id))
      .returning({ id: wardTable.id });

    return results[0];
  }
}
