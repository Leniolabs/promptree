import React from "react";
import styles from "./Inputs.module.scss";

interface SelectInputProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectInput(props: SelectInputProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange?.(e.target.value);
    },
    [props.onChange]
  );

  return (
    <div className={styles.selectWrapper}>
      <select value={props.value} onChange={handleChange}>
        <option value={""}>{""}</option>

        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
