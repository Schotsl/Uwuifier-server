import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { validateVarchar } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";
import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.0.0/mod.ts";

import OriginEntity from "../entity/OriginEntity.ts";
import OriginRepository from "../repository/OriginRepository.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class OriginController implements InterfaceController {
  private originRepository: OriginRepository;

  constructor(mysqlClient: Client) {
    this.originRepository = new OriginRepository(mysqlClient);
  }

  async getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    response.body = await this.originRepository.getCollection(
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
    await this.originRepository.removeObject(params.uuid);

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

    validateVarchar(value.title, "title");

    const origin = new OriginEntity();
    Object.assign(origin, value);

    response.body = await this.originRepository.addObject(origin);
  }
}
