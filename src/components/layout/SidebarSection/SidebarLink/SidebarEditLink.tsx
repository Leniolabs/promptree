import { className } from "@/utils/classname";
import Link from "next/link";
import React, { ReactNode } from "react";
import styles from "../Sidebar.module.scss";

export function SidebarEditLink(props: {
  href: string;
  icon?: ReactNode;
  extra?: ReactNode;
  onChange?: (value: string) => void;
  value: string;
  onBlur?: () => void;
  onSave?: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const extraRef = React.useRef<HTMLDivElement>(null);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e.target.value);
    },
    [props.onChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        props.onSave?.();
      }
    },
    [props.onSave]
  );

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.addEventListener("blur", (e) => {
        if (!extraRef.current?.contains(e.relatedTarget as HTMLElement)) {
          props.onBlur?.();
        }
      });
    }
  }, [props.onBlur]);

  return (
    <div
      className={className(
        styles.sidebarLink,
        location.pathname === props.href ? styles.active : ""
      )}
    >
      {props.icon}
      <div className={styles.sidebarLinkText}>
        <input
          ref={inputRef}
          className={styles.sidebarLinkInput}
          onChange={handleChange}
          defaultValue={props.value as string}
          onKeyDown={handleKeyDown}
        />
      </div>
      {props.extra && (
        <div ref={extraRef} className={styles.sidebarLinkExtra}>
          {props.extra}
        </div>
      )}
    </div>
  );
}
