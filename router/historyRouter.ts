import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/router/GeneralRouter.ts";
import HistoryController from "../controller/HistoryController.ts";

const historyController = new HistoryController("history");
const historyRouter = new GeneralRouter(
  historyController,
  "server",
);

export default historyRouter.router;
