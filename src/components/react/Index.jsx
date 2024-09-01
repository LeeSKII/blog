import JsonPlaceHolder from "./JsonPlaceHolder";
import React from "react";
import useMouse from "./useMouse";
export default function Index() {
  const [count, setCount] = React.useState(0);
  const { x, y } = useMouse();
  function testEvent() {
    console.log(count);
  }
  return (
    <>
      <div>
        mouse: {x}, {y}
      </div>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <JsonPlaceHolder />
      <JsonPlaceHolder />
      <JsonPlaceHolder />
    </>
  );
}
