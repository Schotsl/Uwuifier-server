import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";

import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryCollection from "../collection/HistoryCollection.ts";
import OriginEntity from "../entity/OriginEntity.ts";
import OriginCollection from "../collection/OriginCollection.ts";

import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

import ipv64 from "../ipv64.ts";

export default class HistoryController implements InterfaceController {
  private originRepository: GeneralRepository;
  private generalController: GeneralController;

  constructor(
    name: string,
  ) {
    this.originRepository = new GeneralRepository(
      "origin",
      OriginEntity,
      OriginCollection,
    );

    this.generalController = new GeneralController(
      name,
      HistoryEntity,
      HistoryCollection,
    );
  }

  async getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    await this.generalController.getCollection({ response, state });
  }

  async getObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    await this.generalController.getObject({ response, params });
  }

  async removeObject(
    { response, params }: {
      response: Response;
      request: Request;
      params: { uuid: string };
    },
  ) {
    await this.generalController.removeObject({ response, params });
  }

  async addObject(
    { request, response }: {
      request: Request;
      response: Response;
    },
  ) {
    const body = await request.body();
    const value = await body.value;

    // I've set these default values for outdated Android apps who don't send proper data
    value.amount = typeof value.amount === "undefined" ? 1 : value.amount;

    if (typeof value.origin === "undefined") {
      // If the user has provided no origin we'll default to "android"
      value.origin = "d5513234-d314-4ea1-a5a9-5eb7c8590e68";
    } else {
      // The getObject function will throw an error towards the user if the origin is not found
      await this.originRepository.getObject(value.origin);
    }

    // Fetch the clients and server IP for storage
    const server = ipv64;
    const client = request.ip === "127.0.0.1" ? ipv64 : request.ip;

    const responses = await Promise.all([
      fetch(`http://ip-api.com/json/${server}?fields=192`),
      fetch(`http://ip-api.com/json/${client}?fields=192`),
    ]);

    const parsed = await Promise.all([
      responses[0].json(),
      responses[1].json(),
    ]);

    value.server = {
      ip: server,
      cords: {
        lat: parsed[0].lat,
        lng: parsed[0].lon,
      },
    };

    value.client = {
      ip: client,
      cords: {
        lat: parsed[1].lat,
        lng: parsed[1].lon,
      },
    };

    await this.generalController.addObject({ request, response, value });
  }
}
