import { SQL, sql } from "drizzle-orm";
import { AnyPgColumn, customType } from "drizzle-orm/pg-core";

export function lower(col: AnyPgColumn): SQL {
  return sql`lower(${col})`;
}

export const customTextCollation = customType<{
  data: string;
}>({
  dataType() {
    return "nvarchar(n) COLLATION Vietnamese_CI_AI";
  },
});
