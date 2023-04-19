import React from "react";
import styles from "./Inputs.module.scss";

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function TextInput(props: TextInputProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e.target.value);
    },
    [props.onChange]
  );

  return (
    <div className={styles.inputWrapper}>
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={handleChange}
      />
    </div>
  );
}
