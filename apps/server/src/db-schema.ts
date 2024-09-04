import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const customerTable = pgTable("customer", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productTable = pgTable("product", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  barcode: text("barcode"),
  price: integer("price").default(0).notNull(),
  salePrice: integer("sale_price"),
  costPrice: integer("cost_price").default(0).notNull(),
  createdByUserId: integer("created_by_user_id")
    .references(() => userTable.id)
    .default(-1)
    .notNull(),
  updatedByUserId: integer("updated_by_user_id")
    .references(() => userTable.id)
    .default(-1)
    .notNull(),
  status: integer("status").notNull(),
});

export const customerOrderTable = pgTable("customer_order", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  customerId: integer("customer_id").references(() => customerTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  customerEmail: text("customer_email"),
});

export const provinceTable = pgTable("province", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  code: varchar("code", { length: 256 }).unique(),
  name: varchar("name"),
  nameEn: varchar("name_en", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  fullNameEn: varchar("full_name_en", { length: 256 }),
  codeName: varchar("code_name", { length: 256 }),
});

export const districtTable = pgTable("district", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  code: varchar("code", { length: 256 }).unique(),
  name: varchar("name"),
  nameEn: varchar("name_en", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  fullNameEn: varchar("full_name_en", { length: 256 }),
  codeName: varchar("code_name", { length: 256 }),
  provinceCode: varchar("province_code", { length: 256 }).references(
    () => provinceTable.code
  ),
});

export const wardTable = pgTable("ward", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  code: varchar("code", { length: 256 }).unique(),
  name: varchar("name"),
  nameEn: varchar("name_en", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  fullNameEn: varchar("full_name_en", { length: 256 }),
  codeName: varchar("code_name", { length: 256 }),
  districtCode: varchar("district_code", { length: 256 }).references(
    () => districtTable.code
  ),
});
