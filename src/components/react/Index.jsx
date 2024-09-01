import JsonPlaceHolder from "./JsonPlaceHolder";
import React from "react";
export default function Index() {
  const [count, setCount] = React.useState(0);
  function testEvent() {
    console.log(count);
  }
  return (
    <>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <JsonPlaceHolder />
      <JsonPlaceHolder />
      <JsonPlaceHolder />
    </>
  );
}
