export function className(...names: (string | boolean | null | undefined)[]) {
  return names.filter((x) => x).join(" ");
}
