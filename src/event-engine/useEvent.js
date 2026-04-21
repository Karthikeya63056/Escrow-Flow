/**
 * React hook for subscribing to events in components.
 */
import { useEffect, useRef } from "react";
import { on } from "./eventBus";

export function useEvent(eventType, callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = on(eventType, (evt) => callbackRef.current(evt));
    return unsub;
  }, [eventType]);
}
