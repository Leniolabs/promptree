import React from "react";
import hljs from "highlight.js/lib/core";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { className } from "@/utils/classname";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import styles from "./Chat.module.scss";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("python", python);

export function CodeHighlighter(props: CodeProps) {
  const codeRef = React.useRef<HTMLElement>(null);

  const [language, setLanguage] = React.useState("");

  React.useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);

      const lang =
        codeRef?.current?.className
          .split(" ")
          .find((c) => c.includes("language"))
          ?.split("-")?.[1] || "";

      setLanguage(lang !== "undefined" ? lang : "plain-text");
    }
  }, [props.children]);

  if (props.inline) {
    return <code>{props.children}</code>;
  }

  return (
    <pre>
      <div className={styles.codeHighlighter}>
        <div className={styles.codeHighlighterHeader}>
          <span>{language}</span>
        </div>
        <div className={styles.codeHighlighterContent}>
          <code
            className={"hljs"}
            ref={codeRef}
          >
            {props.children}
          </code>
        </div>
      </div>
    </pre>
  );
}
