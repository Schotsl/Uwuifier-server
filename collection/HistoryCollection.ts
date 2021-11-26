import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";
import HistoryEntity from "../entity/HistoryEntity.ts";

export default class HistoryCollection extends BaseCollection {
  public histories: HistoryEntity[] = [];
}
