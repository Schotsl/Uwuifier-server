import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";
import OriginEntity from "../entity/OriginEntity.ts";

export default class OriginCollection extends BaseCollection {
  public origins: OriginEntity[] = [];
}
