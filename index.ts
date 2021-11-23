import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  errorHandler,
  limitHandler,
  postHandler,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/middleware.ts";

import historyRouter from "./router/historyRouter.ts";
import translateRouter from "./router/translateRouter.ts";

const application = new Application();

application.use(oakCors());

application.use(errorHandler);
application.use(limitHandler);
application.use(postHandler);

application.use(translateRouter.routes());
application.use(historyRouter.routes());

application.use(translateRouter.allowedMethods());
application.use(historyRouter.allowedMethods());

application.listen({ port: 8080 });
