import { SQLWrapper, and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { DBType } from "../config/database";
import { districtTable } from "../db-schema";
import { WithAuthenParams } from "../models/base";
import {
  CreateDistrictParams,
  DISTRICT_RELATION_LIST,
  DeleteDistrictParams,
  DeleteMultipleDistrictParams,
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

  getRelations(includes?: string) {
    if (!includes) return undefined;

    const relations = includes.split(",").map((ele) => ele.trim());

    let relationObj: object | undefined;

    relations.forEach((relation) => {
      const relationType = relation as (typeof DISTRICT_RELATION_LIST)[number];
      if (!DISTRICT_RELATION_LIST.includes(relationType)) return;

      switch (relationType) {
        case "province":
        case "wards":
          relationObj = { ...(relationObj ?? {}), [relationType]: true };
          break;
        default:
          break;
      }
    });

    return relationObj;
  }

  async getListPagePagination(params: GetListDistrictParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      page = 1,
      name,
      provinceCode,
      includes,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${districtTable.fullName}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );
    if (provinceCode)
      filters.push(eq(districtTable.provinceCode, provinceCode));

    const relations = this.getRelations(includes);

    //* Queries
    const districtList = await this.db.query.districtTable.findMany({
      where: and(...filters),
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortOrder === "asc"
          ? asc(districtTable[sortBy ?? "createdAt"])
          : desc(districtTable[sortBy ?? "createdAt"]),
      with: relations,
    });

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
      includes,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${districtTable.fullName}) ilike unaccent('%${sql.raw(
          name
        )}%')`
      );
    if (provinceCode)
      filters.push(eq(districtTable.provinceCode, provinceCode));

    const relations = this.getRelations(includes);

    //* Queries
    const districtList = await this.db.query.districtTable.findMany({
      where: and(...filters),
      limit: limit + 1,
      offset: offset,
      orderBy:
        sortOrder === "asc"
          ? asc(districtTable[sortBy ?? "createdAt"])
          : desc(districtTable[sortBy ?? "createdAt"]),
      with: relations,
    });

    let hasMore = districtList.length > limit;

    //* Results

    return {
      districts: districtList.slice(0, limit),
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailDistrictParams) {
    const { id, includes } = params;

    const relations = this.getRelations(includes);

    return await this.db.query.districtTable.findFirst({
      where: eq(districtTable.id, id),
      with: relations,
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

  async multipleDelete(params: DeleteMultipleDistrictParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(districtTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(districtTable)
      .where(or(...filters))
      .returning({ id: districtTable.id });

    return result;
  }
}
