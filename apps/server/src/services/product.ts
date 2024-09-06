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
import { productTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateProductParams,
  DeleteMultipleProductParams,
  DeleteProductParams,
  GetDetailProductParams,
  GetListProductParams,
  UpdateProductParams,
} from "../models/product";

export default class ProductService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async getTotal() {
    const result = await this.db.select({ count: count() }).from(productTable);

    return result[0].count;
  }

  async getListPagePagination(params: GetListProductParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, barcode, name } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${productTable.name}) ilike unaccent('%${sql.raw(name)}%')`
      );
    if (barcode) filters.push(like(productTable.barcode, barcode));

    //* Queries
    const productList = await this.db
      .select()
      .from(productTable)
      .where(and(...filters))
      .limit(limit)
      .offset(limit * (page - 1))
      .orderBy(
        sortOrder === "asc"
          ? asc(productTable[sortBy ?? "createdAt"])
          : desc(productTable[sortBy ?? "createdAt"])
      );

    const totalQueryResult = await this.db
      .select({ count: count() })
      .from(productTable)
      .where(and(...filters));

    //* Results
    const total = Number(totalQueryResult?.[0]?.count);
    const totalPages = Math.ceil(total / limit);

    return {
      products: productList,
      meta: {
        limit: limit,
        page: page,
        total: total,
        totalPages: totalPages,
      },
    };
  }

  async getListOffsetPagination(params: GetListProductParams) {
    const { sortBy, sortOrder, limit = 10, offset = 0, barcode, name } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${productTable.name}) ilike unaccent('%${sql.raw(name)}%')`
      );
    if (barcode) filters.push(like(productTable.barcode, barcode));

    //* Queries
    const productList = await this.db.query.productTable.findMany({
      where: and(...filters),
      limit: limit + 1,
      offset: offset,
      orderBy:
        sortOrder === "asc"
          ? asc(productTable[sortBy ?? "createdAt"])
          : desc(productTable[sortBy ?? "createdAt"]),
    });

    let hasMore = productList.length > limit;

    //* Results
    return {
      products: productList.slice(0, limit),
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailProductParams) {
    const { id } = params;

    return await this.db.query.productTable.findFirst({
      where: eq(productTable.id, id),
    });
  }

  async create(params: WithAuthenParams<CreateProductParams>) {
    const { userId, ...body } = params;

    const results = await this.db
      .insert(productTable)
      .values({
        ...body,
        createdByUserId: userId,
        updatedByUserId: userId,
      })
      .returning();

    return results[0];
  }

  async update(params: WithAuthenParams<UpdateProductParams>) {
    const { id, userId, ...rest } = params;

    const results = await this.db
      .update(productTable)
      .set({
        ...rest,
        updatedAt: sql`now()`,
        updatedByUserId: userId,
      })
      .where(eq(productTable.id, id))
      .returning();

    return results[0];
  }

  async delete(params: DeleteProductParams) {
    const { id } = params;

    const results = await this.db
      .delete(productTable)
      .where(eq(productTable.id, id))
      .returning({ id: productTable.id });

    return results[0];
  }

  async multipleDelete(params: DeleteMultipleProductParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(productTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(productTable)
      .where(or(...filters))
      .returning({ id: productTable.id });

    return result;
  }
}
