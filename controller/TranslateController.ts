import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { Request, Response } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { validateDatatype } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";

import Uwuifier from "https://deno.land/x/uwuifier/src/index.ts";
import TranslateEntity from "../entity/TranslateEntity.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class TranslateController implements InterfaceController {
  getCollection() {
    throw new MissingImplementation();
  }

  removeObject() {
    throw new MissingImplementation();
  }

  updateObject() {
    throw new MissingImplementation();
  }

  async addObject(
    { response, request }: {
      response: Response;
      request: Request;
    },
  ) {
    const body = await request.body();
    const value = await body.value;

    validateDatatype(value.content, "content", "string");

    const translate = new TranslateEntity();
    const uwuifier = new Uwuifier();

    translate.content = uwuifier.uwuifySentence(value.content);
    response.body = translate;
  }
}
