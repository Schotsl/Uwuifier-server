import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import {
  validateSmallint,
  validateVarchar,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";

import {
  Context,
  Request,
  Response,
  ServerSentEvent,
  ServerSentEventTarget,
  State,
} from "https://deno.land/x/oak@v10.0.0/mod.ts";

import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryRepository from "../repository/HistoryRepository.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

import ipv64 from "../ipv64.ts";

export default class HistoryController implements InterfaceController {
  private historyRepository: HistoryRepository;
  private subscribedClients: ServerSentEventTarget[] = [];

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

  subscribeObject(ctx: Context) {
    const target = ctx.sendEvents();

    this.subscribedClients.push(target);
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

    validateVarchar(value.origin, "origin", true);
    validateSmallint(value.amount, "amount", true);

    value.amount = typeof value.amount === "undefined" ? 1 : value.amount;
    value.origin = typeof value.origin === "undefined"
      ? "android"
      : value.origin;

    const server = ipv64;
    const client = request.ip === "127.0.0.1" ? ipv64 : request.ip;

    // TODO: Could be ran in parallel

    const history = new HistoryEntity();
    const responses = await Promise.all([
      fetch(`http://ip-api.com/json/${server}?fields=192`),
      fetch(`http://ip-api.com/json/${client}?fields=192`),
    ]);

    const parsed = await Promise.all([
      responses[0].json(),
      responses[1].json(),
    ]);

    Object.assign(history, value);

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

    const fetched = await this.historyRepository.addObject(history);
    const message = new ServerSentEvent("message", fetched);

    this.subscribedClients.forEach((subscribedClient) => {
      subscribedClient.dispatchEvent(message);
    });

    response.body = fetched;
  }
}
