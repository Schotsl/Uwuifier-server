import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

import mysqlClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/connections/mysql.ts";
import TranslateController from "../controller/TranslateController.ts";

const translateController = new TranslateController(mysqlClient);
const translateRouter = new Router({
  prefix: "/v1/translate",
});

translateRouter.get(
  "/",
  translateController.getCollection.bind(translateController),
);

translateRouter.post(
  "/",
  translateController.addObject.bind(translateController),
);

translateRouter.put(
  "/:uuid",
  translateController.updateObject.bind(translateController),
);

translateRouter.delete(
  "/:uuid",
  translateController.removeObject.bind(translateController),
);

export default translateRouter;
