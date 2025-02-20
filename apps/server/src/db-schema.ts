import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
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

export const productRelation = relations(productTable, ({ many }) => ({
  productInGoodsReceipt: many(goodsReceiptDetailTable),
}));

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
  name: varchar("name").notNull(),
  nameEn: varchar("name_en", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  fullNameEn: varchar("full_name_en", { length: 256 }),
  codeName: varchar("code_name", { length: 256 }),
});

export const provinceRelation = relations(provinceTable, ({ many }) => ({
  districts: many(districtTable),
}));

export const districtTable = pgTable("district", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  code: varchar("code", { length: 256 }).unique(),
  name: varchar("name").notNull(),
  nameEn: varchar("name_en", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  fullNameEn: varchar("full_name_en", { length: 256 }),
  codeName: varchar("code_name", { length: 256 }),
  provinceCode: varchar("province_code", { length: 256 }).references(
    () => provinceTable.code
  ),
});

export const districtRelation = relations(districtTable, ({ one, many }) => ({
  province: one(provinceTable, {
    fields: [districtTable.provinceCode],
    references: [provinceTable.code],
  }),
  wards: many(wardTable),
}));

export const wardTable = pgTable("ward", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  code: varchar("code", { length: 256 }).unique(),
  name: varchar("name").notNull(),
  nameEn: varchar("name_en", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  fullNameEn: varchar("full_name_en", { length: 256 }),
  codeName: varchar("code_name", { length: 256 }),
  districtCode: varchar("district_code", { length: 256 }).references(
    () => districtTable.code
  ),
});

export const wardRelation = relations(wardTable, ({ one }) => ({
  district: one(districtTable, {
    fields: [wardTable.districtCode],
    references: [districtTable.code],
  }),
}));

export const warehouseTable = pgTable("warehouse", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar("name").notNull(),
});

export const warehouseRelation = relations(warehouseTable, ({ many }) => ({
  inventories: many(inventoryTable),
  goodsReceipts: many(goodsReceiptTable),
}));

export const inventoryTable = pgTable(
  "inventory",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    productId: integer("product_id")
      .references(() => productTable.id)
      .notNull(),
    warehouseId: integer("warehouse_id")
      .references(() => warehouseTable.id)
      .notNull(),
    quantityAvailable: integer("quantity_available").default(0).notNull(),
    minimumStockLevel: integer("minimum_stock_level").default(0).notNull(),
    maximumStockLevel: integer("maximum_stock_level").default(0).notNull(),
    reorderPoint: integer("reorder_point").default(0).notNull(),
  },
  (table) => ({
    productInWarehouse: unique("product_in_warehouse").on(
      table.productId,
      table.warehouseId
    ),
  })
);

export const inventoryRelation = relations(inventoryTable, ({ one }) => ({
  warehouse: one(warehouseTable, {
    fields: [inventoryTable.warehouseId],
    references: [warehouseTable.id],
  }),
}));

export const goodsReceiptTable = pgTable("goods_receipt", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdByUserId: integer("created_by_user_id")
    .references(() => userTable.id)
    .default(-1)
    .notNull(),
  updatedByUserId: integer("updated_by_user_id")
    .references(() => userTable.id)
    .default(-1)
    .notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouseTable.id)
    .notNull(),
  status: integer("status").notNull(),
});

export const goodsReceiptRelation = relations(
  goodsReceiptTable,
  ({ one, many }) => ({
    warehouse: one(warehouseTable, {
      fields: [goodsReceiptTable.warehouseId],
      references: [warehouseTable.id],
    }),
    detail: many(goodsReceiptDetailTable),
  })
);

export const goodsReceiptDetailTable = pgTable(
  "goods_receipt_detail",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    goodsReceiptId: integer("goods_receipt_id")
      .references(() => goodsReceiptTable.id)
      .notNull(),
    productId: integer("product_id")
      .references(() => productTable.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    productInGoodsReceipt: unique("product_in_goods_receipt").on(
      table.productId,
      table.goodsReceiptId
    ),
  })
);

export const goodsReceiptDetailRelation = relations(
  goodsReceiptDetailTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [goodsReceiptDetailTable.productId],
      references: [productTable.id],
    }),
    goodsReceipt: one(goodsReceiptTable, {
      fields: [goodsReceiptDetailTable.goodsReceiptId],
      references: [goodsReceiptTable.id],
    }),
  })
);

export const goodsIssueTable = pgTable("goods_issue", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdByUserId: integer("created_by_user_id")
    .references(() => userTable.id)
    .default(-1)
    .notNull(),
  updatedByUserId: integer("updated_by_user_id")
    .references(() => userTable.id)
    .default(-1)
    .notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouseTable.id)
    .notNull(),
  status: integer("status").notNull(),
});

export const goodsIssueRelation = relations(
  goodsIssueTable,
  ({ one, many }) => ({
    warehouse: one(warehouseTable, {
      fields: [goodsIssueTable.warehouseId],
      references: [warehouseTable.id],
    }),
    detail: many(goodsIssueDetailTable),
  })
);

export const goodsIssueDetailTable = pgTable(
  "goods_issue_detail",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    goodsIssueId: integer("goods_issue_id")
      .references(() => goodsIssueTable.id)
      .notNull(),
    productId: integer("product_id")
      .references(() => productTable.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    productInGoodsIssue: unique("product_in_goods_issue").on(
      table.productId,
      table.goodsIssueId
    ),
  })
);

export const goodsIssueDetailRelation = relations(
  goodsIssueDetailTable,
  ({ one }) => ({
    goodsIssue: one(goodsIssueTable, {
      fields: [goodsIssueDetailTable.goodsIssueId],
      references: [goodsIssueTable.id],
    }),
  })
);
