import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./controllers/auth";
import { districtRoutes } from "./controllers/district";
import { productRoutes } from "./controllers/product";
import { provinceRoutes } from "./controllers/province";
import { wardRoutes } from "./controllers/ward";
import { errorPlugin } from "./utils/plugins";

const app = new Elysia({ name: "root" })
  .use(
    swagger({
      path: "/api-documentation",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(cors())
  .use(errorPlugin)
  //! Only used for testing delay
  // .onBeforeHandle(async () => {
  //   await new Promise((r) => setTimeout(r, 3000));
  // })
  .use(authRoutes)
  .use(productRoutes)
  .use(provinceRoutes)
  .use(districtRoutes)
  .use(wardRoutes)
  .listen(9000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
