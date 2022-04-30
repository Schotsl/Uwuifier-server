import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/router/GeneralRouter.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/GeneralController.ts";

import OriginEntity from "../entity/OriginEntity.ts";
import OriginCollection from "../collection/OriginCollection.ts";

const projectController = new GeneralController(
  "origin",
  OriginEntity,
  OriginCollection,
);

const projectRouter = new GeneralRouter(
  projectController,
  "origin",
);

export default projectRouter.router;
