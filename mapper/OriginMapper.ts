import { restoreUUID } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/helper.ts";

import OriginEntity from "../entity/OriginEntity.ts";
import InterfaceMapper from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/mapper/InterfaceMapper.ts";
import OriginCollection from "../collection/OriginCollection.ts";

export default class OriginMapper implements InterfaceMapper {
  public mapObject(row: Record<string, never>): OriginEntity {
    const uuid = restoreUUID(row.uuid);
    const origin = new OriginEntity(uuid);

    origin.created = row.created;
    origin.updated = row.updated;
    origin.title = row.title;

    return origin;
  }

  public mapArray(
    rows: Record<string, never>[],
  ): OriginEntity[] {
    const entries = rows.map((row) => this.mapObject(row));
    return entries;
  }

  public mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): OriginCollection {
    const origins = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      origins,
    };
  }
}
