import React from "react";

export function useScrollToBottom<T extends HTMLElement>(...deps: any) {
  const containerRef = React.useRef<T>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container)
      if (container.scrollHeight > container.clientHeight) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
  }, [...deps]);

  return containerRef;
}
