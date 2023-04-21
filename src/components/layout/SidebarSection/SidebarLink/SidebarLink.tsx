import { className } from "@/utils/classname";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styles from "../Sidebar.module.scss";

type SidebarLinkProps = {
  icon?: ReactNode;
  extra?: ReactNode;
  extraForced?: ReactNode;
  label: string;
  border?: boolean;
} & (
  | {
      href: string;
    }
  | {
      onClick?: () => void;
    }
);

export function SidebarLink(props: SidebarLinkProps) {
  const location = useRouter();

  const active = "href" in props && location.pathname === props.href;

  if ("href" in props)
    return (
      <Link
        href={props.href}
        className={className(
          styles.sidebarLink,
          props.border && styles.border,
          active ? styles.active : ""
        )}
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

  return (
    <button
      onClick={props.onClick}
      className={className(
        styles.sidebarLink,
        props.border && styles.border,
        active ? styles.active : ""
      )}
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
    </button>
  );
}
