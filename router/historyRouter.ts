import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

import mysqlClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/connections/mysql.ts";
import HistoryController from "../controller/HistoryController.ts";

const historyController = new HistoryController(mysqlClient);
const historyRouter = new Router({
  prefix: "/v1/history",
});

historyRouter.get(
  "/",
  historyController.getCollection.bind(historyController),
);

historyRouter.post(
  "/",
  historyController.addObject.bind(historyController),
);

historyRouter.put(
  "/:uuid",
  historyController.updateObject.bind(historyController),
);

historyRouter.delete(
  "/:uuid",
  historyController.removeObject.bind(historyController),
);

historyRouter.get(
  "/subscribe",
  historyController.subscribeObject.bind(historyController),
);

export default historyRouter;
