import styles from "./Icons.module.scss";

export function CheckIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.icon}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
