import { useEffect, useState } from "react";

export function useScrambledPrice(
  price: number,
  iterationsCount = 5,
  interval = 50
) {
  const [scrambled, setScrambled] = useState(String(price));

  useEffect(() => {
    let iterations = 0;
    const timer = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 10 ** String(price).length);
      setScrambled(randomNum.toString());
      iterations++;
      if (iterations > iterationsCount) {
        clearInterval(timer);
        setScrambled(String(price));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [price, iterationsCount, interval]);

  return scrambled;
}
