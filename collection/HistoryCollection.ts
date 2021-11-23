import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";
import HistortyEntity from "../entity/HistoryEntity.ts";

export default class HistoryCollection extends BaseCollection {
  public histories: HistortyEntity[] = [];
}
