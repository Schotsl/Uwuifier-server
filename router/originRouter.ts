import { Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";

import mysqlClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/connections/mysql.ts";
import OriginController from "../controller/OriginController.ts";

const originController = new OriginController(mysqlClient);
const originRouter = new Router({
  prefix: "/v1/origin",
});

originRouter.get(
  "/",
  originController.getCollection.bind(originController),
);

originRouter.post(
  "/",
  originController.addObject.bind(originController),
);

originRouter.put(
  "/:uuid",
  originController.updateObject.bind(originController),
);

originRouter.delete(
  "/:uuid",
  originController.removeObject.bind(originController),
);

export default originRouter;
