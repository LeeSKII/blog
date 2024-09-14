import React from "react";

export default function useMouse() {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  function update(event: MouseEvent) {
    setMouse({ x: event.pageX, y: event.pageY });
  }

  React.useEffect(() => {
    window.addEventListener("mousemove", update);
    return () => {
      window.removeEventListener("mousemove", update);
    };
  }, []);
  return mouse;
}
