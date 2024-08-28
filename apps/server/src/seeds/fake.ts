import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/postgres-js/driver";
import postgres from "postgres";
import { productTable } from "../db-schema";
import { CreateProductParams } from "../models/product";

const sizes = {
  small: {
    products: 20,
  },
  medium: {
    products: 50,
  },
} as const;

async function seed(size: keyof typeof sizes) {
  const config = sizes[size];

  try {
    const client = postgres({
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    });

    const db = drizzle(client, { logger: false });

    console.log("Seeding products...");

    let productModels: CreateProductParams[] = [];

    for (let productId = 1; productId <= config.products; productId++) {
      productModels.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        barcode: faker.commerce.isbn(),
        price: parseInt(faker.commerce.price({ min: 100000, max: 200000 }), 10),
        salePrice: parseInt(
          faker.commerce.price({ min: 50000, max: 100000 }),
          10
        ),
        costPrice: parseInt(
          faker.commerce.price({ min: 50000, max: 100000 }),
          10
        ),
        createdByUserId: 1,
        updatedByUserId: 1,
        status: 0,
      });
    }
    if (productModels.length) {
      await db.insert(productTable).values(productModels).execute();
    }

    console.log("done!");
    process.exit(0);
  } catch (error) {
    console.log("FATAL ERROR:", error);
  }
}

seed("small");
