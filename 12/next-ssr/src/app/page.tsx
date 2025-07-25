"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState(new Date().toISOString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toISOString());
    }, 1000);

    return clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Next + React SSR</h1>
      <p>Time: {time}</p>
    </div>
  );
}
