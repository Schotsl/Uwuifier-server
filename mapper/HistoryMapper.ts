import { restoreUUID } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/helper.ts";

import HistoryEntity from "../entity/HistoryEntity.ts";
import InterfaceMapper from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/mapper/InterfaceMapper.ts";
import HistoryCollection from "../collection/HistoryCollection.ts";

export default class HistoryMapper implements InterfaceMapper {
  public mapObject(row: Record<string, never>): HistoryEntity {
    const uuid = restoreUUID(row.uuid);
    const history = new HistoryEntity(uuid);

    history.created = row.created;
    history.updated = row.updated;
    history.amount = row.amount;
    history.origin = row.origin;
    history.client = row.client;
    history.server = row.server;

    return history;
  }

  public mapArray(
    rows: Record<string, never>[],
  ): HistoryEntity[] {
    const entries = rows.map((row) => this.mapObject(row));
    return entries;
  }

  public mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): HistoryCollection {
    const histories = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      histories,
    };
  }
}
