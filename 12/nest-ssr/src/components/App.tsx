import React from 'react';

export function App(props: { time: string }) {
  return (
    <div>
      <h1>Nest + React SSR</h1>
      <p>Server time: {props.time}</p>
      <p>This HTML was rendered on the server (no hydration).</p>
    </div>
  );
}
