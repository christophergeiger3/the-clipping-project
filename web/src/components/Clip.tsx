import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Redirect to clip location
export default function Clip() {
  const { name } = useParams<{ name: string }>();
  useEffect(() => {
    window.location.href = `${process.env.REACT_APP_API_URL}/${name}`;
  }, [name]);
  return <></>;
}
