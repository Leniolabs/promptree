import uuid from "uuid";

const allowedChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomChar() {
  return allowedChars[Math.round(Math.random() * allowedChars.length)];
}

function randomString(length: number = 16) {
  return new Array(length)
    .fill(0)
    .map(() => getRandomChar())
    .join("");
}

export function getId() {
  return randomString();
}