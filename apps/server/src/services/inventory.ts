import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { inventoryTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateInventoryParams,
  DeleteInventoryParams,
  DeleteMultipleInventoryParams,
  GetDetailInventoryParams,
  GetListInventoryParams,
  UpdateInventoryParams,
} from "../models/inventory";

export default class InventoryService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db
      .select({ count: count() })
      .from(inventoryTable);

    return result[0].count;
  }

  async getListPagePagination(params: GetListInventoryParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      page = 1,
      warehouseId,
      productId,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];
    if (warehouseId) filters.push(eq(inventoryTable.warehouseId, warehouseId));
    if (productId) filters.push(eq(inventoryTable.productId, productId));

    //* Queries
    const inventoryList = await this.db
      .select()
      .from(inventoryTable)
      .where(and(...filters))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(inventoryTable[sortBy ?? "createdAt"])
          : desc(inventoryTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(inventoryTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      inventorys: inventoryList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListInventoryParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      offset = 0,
      warehouseId,
      productId,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];
    if (warehouseId) filters.push(eq(inventoryTable.warehouseId, warehouseId));
    if (productId) filters.push(eq(inventoryTable.productId, productId));

    //* Queries
    const inventoryList = await this.db
      .select()
      .from(inventoryTable)
      .where(and(...filters))
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(inventoryTable[sortBy ?? "createdAt"])
          : desc(inventoryTable[sortBy ?? "createdAt"])
      );

    let hasMore = false;

    if (inventoryList.length === limit) {
      const totalQueryResult = await this.db
        .select({ count: count() })
        .from(inventoryTable)
        .where(and(...filters));

      const total = Number(totalQueryResult?.[0]?.count);

      hasMore =
        total > limit * (offset / limit) + inventoryList.length ? true : false;
    } else {
      hasMore = inventoryList.length > limit ? true : false;
    }

    //* Results

    return {
      inventorys: inventoryList,
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailInventoryParams) {
    const { id } = params;

    return await this.db.query.inventoryTable.findFirst({
      where: eq(inventoryTable.id, id),
    });
  }

  async create(params: WithAuthenParams<CreateInventoryParams>) {
    const { userId, ...body } = params;

    const results = await this.db
      .insert(inventoryTable)
      .values({
        ...body,
      })
      .returning();

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateInventoryParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(inventoryTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
      })
      .where(eq(inventoryTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteInventoryParams) {
    const { id } = params;

    const results = await this.db
      .delete(inventoryTable)
      .where(eq(inventoryTable.id, id))
      .returning({ id: inventoryTable.id });

    return results[0];
  }

  async multipleDelete(params: DeleteMultipleInventoryParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(inventoryTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(inventoryTable)
      .where(or(...filters))
      .returning({ id: inventoryTable.id });

    return result;
  }
}
