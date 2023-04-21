import Link from "next/link";
import styles from "./Buttons.module.scss";

export function ButtonLink(
  props: React.PropsWithChildren<{
    onClick?: () => void;
    href?: string;
  }>
) {
  if (props.href) {
    return (
      <Link className={styles.buttonLink} href={props.href}>
        {props.children}
      </Link>
    );
  }

  return (
    <div className={styles.buttonLink} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
