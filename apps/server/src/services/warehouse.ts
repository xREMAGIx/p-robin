import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { warehouseTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateWarehouseParams,
  DeleteMultipleWarehouseParams,
  DeleteWarehouseParams,
  GetDetailWarehouseParams,
  GetListWarehouseParams,
  UpdateWarehouseParams,
} from "../models/warehouse";

export default class WarehouseService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db
      .select({ count: count() })
      .from(warehouseTable);

    return result[0].count;
  }

  async getListPagePagination(params: GetListWarehouseParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, name } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${warehouseTable.name}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );

    //* Queries
    const warehouseList = await this.db
      .select()
      .from(warehouseTable)
      .where(and(...filters))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(warehouseTable[sortBy ?? "createdAt"])
          : desc(warehouseTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(warehouseTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      warehouses: warehouseList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListWarehouseParams) {
    const { sortBy, sortOrder, limit = 10, offset = 0, name } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${warehouseTable.name} ) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );

    //* Queries
    const warehouseList = await this.db
      .select()
      .from(warehouseTable)
      .where(and(...filters))
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(warehouseTable[sortBy ?? "createdAt"])
          : desc(warehouseTable[sortBy ?? "createdAt"])
      );

    let hasMore = false;

    if (warehouseList.length === limit) {
      const totalQueryResult = await this.db
        .select({ count: count() })
        .from(warehouseTable)
        .where(and(...filters));

      const total = Number(totalQueryResult?.[0]?.count);

      hasMore =
        total > limit * (offset / limit) + warehouseList.length ? true : false;
    } else {
      hasMore = warehouseList.length > limit ? true : false;
    }

    //* Results

    return {
      warehouses: warehouseList,
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailWarehouseParams) {
    const { id } = params;

    return await this.db.query.warehouseTable.findFirst({
      where: eq(warehouseTable.id, id),
    });
  }

  async create(params: WithAuthenParams<CreateWarehouseParams>) {
    const { userId, ...body } = params;

    const results = await this.db
      .insert(warehouseTable)
      .values({
        ...body,
      })
      .returning();

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateWarehouseParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(warehouseTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(warehouseTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteWarehouseParams) {
    const { id } = params;

    const results = await this.db
      .delete(warehouseTable)
      .where(eq(warehouseTable.id, id))
      .returning({ id: warehouseTable.id });

    return results[0];
  }

  async multipleDelete(params: DeleteMultipleWarehouseParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(warehouseTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(warehouseTable)
      .where(or(...filters))
      .returning({ id: warehouseTable.id });

    return result;
  }
}
