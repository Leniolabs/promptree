import React from "react";

export function useLocalStorageState<T>(name: string, initialValue: T) {
  const [state, _setState] = React.useState(() => {
    return initialValue;
  });

  React.useEffect(() => {
    const savedValue = localStorage.getItem(name);
    if (savedValue) {
      _setState(JSON.parse(savedValue).value);
    } else {
      _setState(initialValue);
    }
  }, []);

  const setState = React.useCallback((state: T) => {
    localStorage.setItem(name, JSON.stringify({ value: state }));
    _setState(state);
  }, []);

  return [state, setState] as [T, (state: T) => void];
}
