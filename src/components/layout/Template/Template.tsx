import React from "react";
import styles from "./Template.module.scss";
import { IconButton } from "@/components/buttons";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { ITemplate } from "@/types/api";

function extractVariables(text: string): string[] {
  const regex = /{{(.*?)}}/g;
  const variables = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    variables.push(match[1]);
  }

  return variables;
}

export function Template(
  props: React.PropsWithChildren<{
    template?: ITemplate;
    onSave?: (
      template: Omit<ITemplate, "id"> & Partial<Pick<ITemplate, "id">>
    ) => void;
  }>
) {
  const [content, setContent] = React.useState(props.template?.content || "");
  const [type, setType] = React.useState(props.template?.type || "input");
  const [title, setTitle] = React.useState(props.template?.title || "title");

  const handleContentChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    []
  );

  const handleTitleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const handleTypeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setType(e.target.value);
    },
    []
  );

  const handleSave = React.useCallback(() => {
    if (props.template) {
      //edit
      props.onSave?.({ ...props.template, title, content, type });
    } else {
      //create
      props.onSave?.({ title, content, type });
    }
  }, [props.onSave, props.template, title, content, type]);

  const handleAddVariable = React.useCallback(() => {
    setContent((content) => {
      const variables = extractVariables(content);

      return content + `{{VAR_${variables.length + 1}}}`;
    });
  }, []);

  return (
    <div className={styles.templateWrapper}>
      <div className={styles.templateTitle}>
        <input type="text" value={title} onChange={handleTitleChange} />
        <select value={type} onChange={handleTypeChange}>
          <option value="input">Type: Input</option>
          <option value="output">Type: Output</option>
        </select>
      </div>
      <div className={styles.templateToolbar}>
        <IconButton icon={<PlusIcon />} onClick={handleAddVariable}>
          Add Variable
        </IconButton>
      </div>
      <div className={styles.templateInputWrapper}>
        <div className={styles.templateTextInputWrapper}>
          <textarea
            className={styles.templateTextArea}
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </div>
      <div className={styles.templateBottomBar}>
        <IconButton icon={<CheckIcon />} onClick={handleSave}>
          Save
        </IconButton>
      </div>
    </div>
  );
}
