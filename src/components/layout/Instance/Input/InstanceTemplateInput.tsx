import React from "react";
import { SendButton } from "@/components/buttons/SendButton";
import styles from "./Input.module.scss";
import { ITemplate } from "@/types/api";

const parseTemplate = (template: ITemplate) => {
  const regex = /{{(.*?)}}/g;
  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(template.content)) !== null) {
    if (match.index > lastIndex) {
      const text = template.content.slice(lastIndex, match.index);
      const lines = text.split("\n");
      lines.forEach((line, idx) => {
        if (idx > 0) {
          parts.push({ type: "newline" });
        }
        if (line.length > 0) {
          parts.push({ type: "text", value: line });
        }
      });
    }
    parts.push({ type: "variable", value: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < template.content.length) {
    const text = template.content.slice(lastIndex);
    const lines = text.split("\n");
    lines.forEach((line, idx) => {
      if (idx > 0) {
        parts.push({ type: "newline" });
      }
      if (line.length > 0) {
        parts.push({ type: "text", value: line });
      }
    });
  }

  return parts;
};

export function InstanceTemplateInput(
  props: React.PropsWithChildren<{
    template: ITemplate;
    onSend?: (message: string) => void;
  }>
) {
  const parsedTemplate = React.useMemo(
    () => parseTemplate(props.template),
    [props.template]
  );

  const [variableValues, setVariableValues] = React.useState<{
    [key: string]: string;
  }>({});

  const variables = React.useMemo(() => {
    return parsedTemplate
      .filter((row) => row.type === "variable")
      .map((row) => row.value);
  }, [parsedTemplate]);

  const handleVariableChange = React.useCallback((variable: string) => {
    return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setVariableValues((d) => ({ ...d, [variable]: e.target.value }));
    };
  }, []);

  const message = React.useMemo(() => {
    if (variables.every((v) => variableValues[v])) {
      return variables.reduce((m, v) => {
        return m.replace(v, variableValues[v]);
      }, props.template.content);
    }
    return null;
  }, [variables, variableValues, props.template]);

  const handleSend = React.useCallback(() => {
    if (message) {
      props.onSend?.(message);
    }
  }, [message, props.onSend]);

  return (
    <div className={styles.instanceInputWrapper}>
      <div className={styles.instanceTextInputWrapper}>
        <div className={styles.instanceTemplate}>
          {parsedTemplate.map((part, index) => {
            if (part.type === "text") {
              return <span key={index}>{part.value}</span>;
            } else if (part.type === "newline") {
              return <br />;
            } else {
              return (
                <textarea
                  key={index}
                  onChange={handleVariableChange(part.value)}
                />
              );
            }
          })}
        </div>
        <SendButton onClick={handleSend} />
      </div>
    </div>
  );
}
