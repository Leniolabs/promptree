import { className } from "@/utils/classname";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styles from "../Sidebar.module.scss";

export function SidebarLink(props: {
  icon?: ReactNode;
  href: string;
  extra?: ReactNode;
  extraForced?: ReactNode;
  label: string;
}) {
  const active = location.pathname === props.href;

  return (
    <Link
      href={props.href}
      className={className(styles.sidebarLink, active ? styles.active : "")}
    >
      {props.icon}
      <div className={styles.sidebarLinkText}>
        {props.label}
        <div className={styles.sidebarLinkBlur} />
      </div>
      {((props.extra && active) || props.extraForced) && (
        <div className={styles.sidebarLinkExtra}>
          {active ? props.extra : null}
          {props.extraForced}
        </div>
      )}
    </Link>
  );
}
