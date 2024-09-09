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
  DeleteMultipleWardParams,
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

  getRelations(includes?: string) {
    if (!includes) return undefined;

    const RELATION_LIST = ["district"] as const;

    const relations = includes.split(",").map((ele) => ele.trim());

    let relationObj: object | undefined;

    relations.forEach((relation) => {
      const relationType = relation as (typeof RELATION_LIST)[number];
      if (!RELATION_LIST.includes(relationType)) return;

      switch (relationType) {
        case "district":
          relationObj = { ...(relationObj ?? {}), [relationType]: true };
          break;
        default:
          break;
      }
    });

    return relationObj;
  }

  async getListPagePagination(params: GetListWardParams) {
    const {
      sortBy,
      sortOrder,
      limit = 10,
      page = 1,
      name,
      districtCode,
      includes,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${wardTable.name}) ilike unaccent('%${sql.raw(name)}%')`
      );
    if (districtCode) filters.push(eq(wardTable.districtCode, districtCode));

    const relations = this.getRelations(includes);

    //* Queries
    const wardList = await this.db.query.wardTable.findMany({
      where: and(...filters),
      limit: limit,
      offset: limit * (page - 1),
      orderBy:
        sortOrder === "asc"
          ? asc(wardTable[sortBy ?? "createdAt"])
          : desc(wardTable[sortBy ?? "createdAt"]),
      with: relations,
    });

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
      includes,
    } = params;

    //* Filters
    const filters: SQLWrapper[] = [];

    if (name)
      filters.push(
        sql`unaccent(${wardTable.name}) ilike unaccent('%${sql.raw(name)}%')`
      );
    if (districtCode) filters.push(eq(wardTable.districtCode, districtCode));

    const relations = this.getRelations(includes);

    //* Queries
    const wardList = await this.db.query.wardTable.findMany({
      where: and(...filters),
      limit: limit + 1,
      offset: offset,
      orderBy:
        sortOrder === "asc"
          ? asc(wardTable[sortBy ?? "createdAt"])
          : desc(wardTable[sortBy ?? "createdAt"]),
      with: relations,
    });

    let hasMore = wardList.length > limit;

    //* Results
    return {
      wards: wardList.slice(0, limit),
      meta: {
        limit: limit,
        offset: offset,
        hasMore: hasMore,
      },
    };
  }

  async getDetail(params: GetDetailWardParams) {
    const { id, includes } = params;

    const relations = this.getRelations(includes);

    const res = await this.db.query.wardTable.findFirst({
      where: eq(wardTable.id, id),
      with: relations,
    });

    return res;
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

  async multipleDelete(params: DeleteMultipleWardParams) {
    const { ids } = params;
    //* Filters
    const filters: SQLWrapper[] = [];

    ids.forEach((id) => {
      filters.push(eq(wardTable.id, id));
    });

    //* Queries
    const result = await this.db
      .delete(wardTable)
      .where(or(...filters))
      .returning({ id: wardTable.id });

    return result;
  }
}
