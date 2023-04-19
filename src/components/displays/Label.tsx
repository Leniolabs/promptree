import { className } from "@/utils/classname";
import React from "react";
import styles from "./Displays.module.scss";

export function Label(
  props: React.PropsWithChildren<{
    align?: "RIGHT" | "LEFT";
  }>
) {
  return (
    <div
      className={className(
        styles.label,
        props.align && styles[props.align.toLocaleLowerCase()]
      )}
    >
      {props.children}
    </div>
  );
}
