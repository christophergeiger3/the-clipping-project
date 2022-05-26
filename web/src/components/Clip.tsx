import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Redirect to clip location
export default function Clip() {
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    window.location.href = "http://localhost:4190/clips/videos/" + id;
  }, [id]);
  return <></>;
}
