import { useEffect, useRef, useState } from "react";

type ScrollStatus = "UP" | "DOWN" | "INIT";

export const useScrollStatus = () => {
  const [scrollStatus, setScrollStatus] = useState<ScrollStatus>("INIT");
  const lastScrollY = useRef(0);

  function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number,
  ) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  useEffect(() => {
    const handleScroll = debounce(() => {
      const current = window.scrollY;
      const last = lastScrollY.current;
      setScrollStatus((prev) => {
        if (current <= 190) return "INIT";
        if (current > last) {
          return "DOWN";
        }
        if (current < last) {
          return "UP";
        }
        return prev;
      });

      lastScrollY.current = current;
    }, 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollStatus;
};
