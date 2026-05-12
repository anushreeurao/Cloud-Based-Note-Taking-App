import { useEffect } from "react";

export function useDebouncedEffect(callback, deps, delay = 650) {
  useEffect(() => {
    const id = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
