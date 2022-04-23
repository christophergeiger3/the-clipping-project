import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// https://dev.to/hritique/send-realtime-data-streams-without-using-socket-io-32l6
export default function Progress() {
  const { id } = useParams<{ id: string }>();

  // const [data, setData] = useState<any>([]);

  // let eventSource = undefined;
  // const eve
  const eventSource = useRef<null | EventSource>(null); // should be useState

  useEffect(() => {
    if (eventSource.current === null) {
      eventSource.current = new EventSource(
        `http://localhost:3000/clips/progress/${id}`
        // { withCredentials: true }  // TODO: add auth to server
      );
      eventSource.current.onmessage = (event: MessageEvent) => {
        console.log(event.data);
      };
    }

    return () => {
      if (eventSource.current !== null) {
        eventSource.current.close();
        // eventSource.current = null;
      }
    };
  }, [id]);

  return <pre>{"some text"}</pre>;
}
