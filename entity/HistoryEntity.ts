import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

export default class HistoryEntity extends BaseEntity {
  public amount: number | undefined;
  public origin: string | undefined;
  public client: string | undefined;
  public server: string | undefined;
}
