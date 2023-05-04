import React from "react";
import hljs from "highlight.js/lib/core";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { className } from "@/utils/classname";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import yaml from "highlight.js/lib/languages/yaml";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import sql from "highlight.js/lib/languages/sql";
import styles from "./Chat.module.scss";

const registeredNames = [
  "javascript",
  "css",
  "python",
  "yaml",
  "json",
  "plaintext",
  "sql",
];

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("python", python);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("sql", sql);

export function CodeHighlighter(props: CodeProps) {
  const content = React.useMemo(() => {
    if (props.children && props.children.length) {
      const firstChild = props.children[0];
      if (typeof firstChild === "string") {
        const chunks = firstChild.split("\n");

        const language = chunks[0].replace("```", "").trim();
        const allowedLanguage = registeredNames.includes(language);

        const text = allowedLanguage
          ? chunks.slice(1).join("\n")
          : chunks.join("\n");

        const highlight = hljs.highlight(text, {
          language: allowedLanguage ? language : "plaintext",
        });

        return {
          language: highlight.language || language.trim(),
          children: highlight?.value,
        };
      }
    }
    return {
      language: "plaintext",
      children: "",
    };
  }, [props.children]);

  if (props.inline) {
    return <code className={"hljs"}>{props.children}</code>;
  }

  return (
    <pre>
      <div className={styles.codeHighlighter}>
        <div className={styles.codeHighlighterHeader}>
          <span>{content.language}</span>
        </div>
        <div className={styles.codeHighlighterContent}>
          <code
            className={className("hljs", "language-" + content.language)}
            dangerouslySetInnerHTML={{ __html: content.children }}
          />
        </div>
      </div>
    </pre>
  );
}
