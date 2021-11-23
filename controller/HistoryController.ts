import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { validateSmallint } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";
import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryRepository from "../repository/HistoryRepository.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

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

  async updateObject(
    { response, request, params }: {
      response: Response;
      request: Request;
      params: { uuid: string };
    },
  ) {
    const body = await request.body();
    const value = await body.value;
    delete value.uuid;

    validateSmallint(value.amount, 'amount', true);

    value.amount = typeof value.amount === "undefined" ? 1 : value.amount

    // TODO: Prevent non existing properties from being copied

    const history = new HistoryEntity(params.uuid);
    Object.assign(history, value);

    response.body = await this.historyRepository.updateObject(history);
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

    validateSmallint(value.amount, 'amount', true);

    value.amount = typeof value.amount === "undefined" ? 1 : value.amount

    const history = new HistoryEntity();
    Object.assign(history, value);

    const fetched = await this.historyRepository.addObject(history);
    response.body = fetched;
  }
}
