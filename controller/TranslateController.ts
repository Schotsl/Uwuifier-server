import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { Request, Response } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { validateDatatype } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";
import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";

import Uwuifier from "https://deno.land/x/uwuifier/src/index.ts";
import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryRepository from "../repository/HistoryRepository.ts";
import TranslateEntity from "../entity/TranslateEntity.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

import ipv64 from "../ipv64.ts";

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

    translate.content = uwuifier.uwuifySentence(value.content);
    response.body = translate;

    const server = ipv64;
    const client = request.ip === "127.0.0.1" ? ipv64 : request.ip;

    // TODO: Could be ran in parallel

    const history = new HistoryEntity();
    const responses = await Promise.all([
      fetch(`http://ip-api.com/json/${server}`),
      fetch(`http://ip-api.com/json/${client}`),
    ]);

    const parsed = await Promise.all([
      responses[0].json(),
      responses[1].json(),
    ]);

    history.origin = "api";
    history.amount = 1;

    history.server = {
      ip: server,
      cords: {
        lat: parsed[0].lat,
        lng: parsed[0].lon,
      },
    };

    history.client = {
      ip: client,
      cords: {
        lat: parsed[1].lat,
        lng: parsed[1].lon,
      },
    };

    // No need to await this
    this.historyRepository.addObject(history);
  }
}
