import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// https://dev.to/hritique/send-realtime-data-streams-without-using-socket-io-32l6
export default function Progress() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    // An instance of EventSource by passing the events URL
    const eventSource = new EventSource(
      `http://localhost:3000/clips/progress/${id}`
    );

    // A function to parse and update the data state
    const updateData = (messageEvent: MessageEvent) => {
      const parsedData = JSON.parse(
        messageEvent.data?.toString() || messageEvent.data
      );
      setData((data: any) => [...data, parsedData]);
      if (parsedData.id === 9) {
        eventSource.close();
      }
    };

    // eventSource now listening to all the events named 'message'
    eventSource.addEventListener("message", updateData);

    // Unsubscribing to the event stream when the component is unmounted
    return () => eventSource.close();
  }, [id]);

  return <pre>{"some text" + data}</pre>;
}
