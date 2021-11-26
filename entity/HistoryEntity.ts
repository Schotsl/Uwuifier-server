import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

interface Data {
  ipv4: string;
  cords: Location;
}

interface Location {
  lat: number;
  lng: number;
}

export default class HistoryEntity extends BaseEntity {
  public amount: number | undefined;
  public origin: string | undefined;

  public client: Data | undefined;
  public server: Data | undefined;
}
