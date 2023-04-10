import Link from "next/link";
import React, { ReactNode } from "react";
import styles from "./Buttons.module.scss";

export function IconLinkButton(
  props: React.PropsWithChildren<{
    icon: ReactNode;
    href: string;
  }>
) {
  return (
    <Link href={props.href} className={styles.smallIconButton}>
      {props.icon}
      {props.children}
    </Link>
  );
}
