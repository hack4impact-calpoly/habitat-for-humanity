import { useState, useEffect } from "react";

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const useScreenSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0 as number,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: getWidth(),
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return translateWidth(windowSize.width);
};

const translateWidth = (width: number) => {
  if (width >= 1200) {
    return "lg";
  }
  if (width >= 1000 && width < 1200) {
    return "tb"; // short for tablet
  }
  if (width >= 900 && width < 1000) {
    return "md";
  }
  if (width >= 600 && width < 900) {
    return "sm";
  }
  if (width >= 0 && width < 600) {
    return "xs";
  }
  return "lg";
};

export { useScreenSize };
