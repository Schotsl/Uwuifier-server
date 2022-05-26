import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import {
  IPv64Column,
  LatColumn,
  LngColumn,
  SmallColumn,
  UUIDColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class HistoryEntity extends BaseEntity {
  public origin = new UUIDColumn("origin");
  public amount = new SmallColumn("amount", false, 1);

  public client_ip = new IPv64Column("client_ip");
  public client_lat = new LatColumn("client_lat");
  public client_lng = new LngColumn("client_lng");

  public server_ip = new IPv64Column("server_ip");
  public server_lat = new LatColumn("server_lat");
  public server_lng = new LngColumn("server_lng");
}
