import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

import TranslateController from "../controller/TranslateController.ts";

const translateController = new TranslateController();
const translateRouter = new Router({
  prefix: "/v1/translate",
});

translateRouter.post(
  "/",
  translateController.addObject.bind(translateController),
);

export default translateRouter;
