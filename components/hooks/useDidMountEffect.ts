import { useRef, useEffect } from "react";

export default function useDidMountEffect(effect: () => void, dependencies: any[]) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      return effect();
    }
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};