import { v4 as uuid } from "uuid";

export function getId() {
  return uuid();
}
