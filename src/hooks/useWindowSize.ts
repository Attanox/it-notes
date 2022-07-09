import * as React from "react";

type TWindowSize = { width: number | undefined; height: number | undefined };

// Hook
const useWindowSize = () => {
  const initialSize = {
    width: undefined,
    height: undefined,
  };

  const [windowSize, setWindowSize] = React.useState<TWindowSize>(initialSize);

  React.useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
