import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { Request, Response } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { validateDatatype } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";
import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";

import Uwuifier from "https://deno.land/x/uwuifier/src/index.ts";
import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryRepository from "../repository/HistoryRepository.ts";
import TranslateEntity from "../entity/TranslateEntity.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

import ipv4 from "../ipv4.ts";

export default class TranslateController implements InterfaceController {
  private historyRepository: HistoryRepository;

  constructor(mysqlClient: Client) {
    this.historyRepository = new HistoryRepository(mysqlClient);
  }

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
    const history = new HistoryEntity();

    translate.content = uwuifier.uwuifySentence(value.content);

    history.origin = "api";
    history.server = ipv4;
    history.client = request.ip;
    history.amount = 1;

    // No need to await this
    this.historyRepository.addObject(history);

    response.body = translate;
  }
}
