import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { MissingResource } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";

import HistoryEntity from "../entity/HistoryEntity.ts";
import HistoryMapper from "../mapper/HistoryMapper.ts";
import HistoryCollection from "../collection/HistoryCollection.ts";
import InterfaceRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/InterfaceRepository.ts";

export default class HistoryRepository implements InterfaceRepository {
  private mysqlClient: Client;
  private historyMapper: HistoryMapper;

  constructor(mysqlClient: Client) {
    this.mysqlClient = mysqlClient;
    this.historyMapper = new HistoryMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<HistoryCollection> {
    const promises = [];

    promises.push(this.mysqlClient.execute(
      `SELECT HEX(history.uuid) AS uuid, history.amount, history.created, history.updated FROM uwuifier.history ORDER BY history.created DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    ));

    promises.push(this.mysqlClient.execute(
      `SELECT COUNT(history.uuid) AS total FROM uwuifier.history`,
    ));

    const data = await Promise.all(promises);
    const rows = data[0].rows!;
    const total = data[1].rows![0].total;

    return this.historyMapper.mapCollection(rows, offset, limit, total);
  }

  public async updateObject(
    object: Partial<HistoryEntity>,
  ): Promise<HistoryEntity> {
    const values = [];
    const exclude = ["created", "updated", "uuid"];

    let query = "UPDATE uwuifier.history SET";

    for (const [key, value] of Object.entries(object)) {
      if (value !== null && !exclude.includes(key)) {
        query += ` history.${key}=?,`;
        values.push(value);
      }
    }

    if (values.length > 0) {
      query = query.slice(0, -1);
      query += " WHERE history.uuid = UNHEX(REPLACE(?, '-', ''))";

      await this.mysqlClient.execute(query, [...values, object.uuid]);
    }

    const data = await this.getObject(object.uuid!);
    return data!;
  }

  public async removeObject(uuid: string): Promise<void> {
    const deleteResult = await this.mysqlClient.execute(
      `DELETE FROM uwuifier.history WHERE history.uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    if (deleteResult.affectedRows === 0) {
      throw new MissingResource("history");
    }
  }

  public async addObject(object: HistoryEntity): Promise<HistoryEntity> {
    await this.mysqlClient.execute(
      `INSERT INTO uwuifier.history (uuid, amount) VALUES(UNHEX(REPLACE(?, '-', '')), ?)`,
      [
        object.uuid,
        object.amount,
      ],
    );

    const result = await this.getObject(object.uuid);
    return result!;
  }

  public async getObject(uuid: string): Promise<HistoryEntity> {
    const data = await this.mysqlClient.execute(
      `SELECT HEX(history.uuid) AS uuid, history.amount, history.created, history.updated FROM uwuifier.history WHERE history.uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource("history");
    }

    const row = data.rows![0];
    return this.historyMapper.mapObject(row);
  }
}
