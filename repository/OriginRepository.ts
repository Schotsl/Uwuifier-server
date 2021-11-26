import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { MissingResource } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";

import OriginEntity from "../entity/OriginEntity.ts";
import OriginMapper from "../mapper/OriginMapper.ts";
import OriginCollection from "../collection/OriginCollection.ts";
import InterfaceRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/InterfaceRepository.ts";

export default class OriginRepository implements InterfaceRepository {
  private mysqlClient: Client;
  private originMapper: OriginMapper;

  constructor(mysqlClient: Client) {
    this.mysqlClient = mysqlClient;
    this.originMapper = new OriginMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<OriginCollection> {
    const promises = [];

    promises.push(this.mysqlClient.execute(
      `SELECT HEX(origin.uuid) AS uuid, origin.title, origin.created, origin.updated FROM uwuifier.origin ORDER BY origin.created DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    ));

    promises.push(this.mysqlClient.execute(
      `SELECT COUNT(origin.uuid) AS total FROM uwuifier.origin`,
    ));

    const data = await Promise.all(promises);
    const rows = data[0].rows!;
    const total = data[1].rows![0].total;

    return this.originMapper.mapCollection(rows, offset, limit, total);
  }

  public async updateObject(
    object: Partial<OriginEntity>,
  ): Promise<OriginEntity> {
    const values = [];
    const exclude = ["created", "updated", "uuid"];

    let query = "UPDATE uwuifier.origin SET";

    for (const [key, value] of Object.entries(object)) {
      if (value !== null && !exclude.includes(key)) {
        query += ` origin.${key}=?,`;
        values.push(value);
      }
    }

    if (values.length > 0) {
      query = query.slice(0, -1);
      query += " WHERE origin.uuid = UNHEX(REPLACE(?, '-', ''))";

      await this.mysqlClient.execute(query, [...values, object.uuid]);
    }

    const data = await this.getObject(object.uuid!);
    return data!;
  }

  public async removeObject(uuid: string): Promise<void> {
    const deleteResult = await this.mysqlClient.execute(
      `DELETE FROM uwuifier.origin WHERE origin.uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    if (deleteResult.affectedRows === 0) {
      throw new MissingResource("origin");
    }
  }

  public async addObject(object: OriginEntity): Promise<OriginEntity> {
    await this.mysqlClient.execute(
      `INSERT INTO uwuifier.origin (uuid, title) VALUES(UNHEX(REPLACE(?, '-', '')), ?)`,
      [
        object.uuid,
        object.title,
      ],
    );

    const result = await this.getObject(object.uuid);
    return result!;
  }

  public async getObject(uuid: string): Promise<OriginEntity> {
    const data = await this.mysqlClient.execute(
      `SELECT HEX(origin.uuid) AS uuid, origin.title, origin.created, origin.updated FROM uwuifier.origin WHERE origin.uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource("origin");
    }

    const row = data.rows![0];
    return this.originMapper.mapObject(row);
  }
}
