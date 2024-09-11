import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { provinceTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateProvinceParams,
  DeleteMultipleProvinceParams,
  DeleteProvinceParams,
  GetDetailProvinceParams,
  GetListProvinceParams,
  PROVINCE_RELATION_LIST,
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

  getRelations(includes?: string) {
    if (!includes) return undefined;

    const relations = includes.split(",").map((ele) => ele.trim());

    let relationObj: object | undefined;

    relations.forEach((relation) => {
      const relationType = relation as (typeof PROVINCE_RELATION_LIST)[number];
      if (!PROVINCE_RELATION_LIST.includes(relationType)) return;

      switch (relationType) {
        case "districts":
          relationObj = { ...(relationObj ?? {}), [relationType]: true };
          break;
        default:
          break;
      }
    });

    return relationObj;
  }

  async getListPagePagination(params: GetListProvinceParams) {
    const { sortBy, sortOrder, limit = 10, page = 1, name, includes } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${provinceTable.fullName}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );

    const relations = this.getRelations(includes);

    //* Queries
    const provinceList = await this.db.query.provinceTable.findMany({
      where: and(...filters),
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortOrder === "asc"
          ? asc(provinceTable[sortBy ?? "createdAt"])
          : desc(provinceTable[sortBy ?? "createdAt"]),
      with: relations,
    });

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

    if (name)
      filters.push(
        sql`unaccent(${provinceTable.fullName}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );

    const relations = this.getRelations(includes);

    //* Queries
    const provinceList = await this.db.query.provinceTable.findMany({
      where: and(...filters),
      limit: limit + 1,
      offset: offset,
      orderBy:
        sortOrder === "asc"
          ? asc(provinceTable[sortBy ?? "createdAt"])
          : desc(provinceTable[sortBy ?? "createdAt"]),
      with: relations,
    });

    let hasMore = provinceList.length > limit;

    //* Results
    return {
      provinces: provinceList.slice(0, limit),
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailProvinceParams) {
    const { id, includes } = params;

    const relations = this.getRelations(includes);

    return await this.db.query.provinceTable.findFirst({
      where: eq(provinceTable.id, id),
      with: relations,
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

  async multipleDelete(params: DeleteMultipleProvinceParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(provinceTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(provinceTable)
      .where(or(...filters))
      .returning({ id: provinceTable.id });

    return result;
  }
}
