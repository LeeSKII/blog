import JsonPlaceHolder from "./JsonPlaceHolder";
import React from "react";
import useMouse from "../../hooks/react/useMouse";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <JsonPlaceHolder count={count} event={testEvent} />
    </>
  );
}
