import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import {
  IPv64Column,
  SmallColumn,
  UUIDColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

// interface Data {
//   ip: string;
//   cords: Location;
// }

// interface Location {
//   lat: number;
//   lng: number;
// }

export default class HistoryEntity extends BaseEntity {
  public origin = new UUIDColumn("origin");
  public amount = new SmallColumn("amount", false, 1);

  public client_ip = new IPv64Column("client_ip");
  public client_lat = new VarcharColumn("client_lat");
  public client_lng = new VarcharColumn("client_lng");

  public server_ip = new IPv64Column("server_ip");
  public server_lat = new VarcharColumn("server_lat");
  public server_lng = new VarcharColumn("server_lng");

  // public client: Data | undefined;
  // public server: Data | undefined;
}
