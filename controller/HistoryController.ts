import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  validateSmallint,
  validateVarchar,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";

import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryRepository from "../repository/HistoryRepository.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

import ipv4 from "../ipv4.ts";

export default class HistoryController implements InterfaceController {
  private historyRepository: HistoryRepository;

  constructor(mysqlClient: Client) {
    this.historyRepository = new HistoryRepository(mysqlClient);
  }

  async getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    response.body = await this.historyRepository.getCollection(
      state.offset,
      state.limit,
    );
  }

  async removeObject(
    { response, params }: {
      response: Response;
      request: Request;
      params: { uuid: string };
    },
  ) {
    await this.historyRepository.removeObject(params.uuid);

    response.status = 204;
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
    delete value.uuid;

    validateVarchar(value.origin, "origin");
    validateSmallint(value.amount, "amount");

    value.server = ipv4;
    value.client = request.ip;
    value.amount = typeof value.amount === "undefined" ? 1 : value.amount;

    const history = new HistoryEntity();
    Object.assign(history, value);

    const fetched = await this.historyRepository.addObject(history);
    response.body = fetched;
  }
}
