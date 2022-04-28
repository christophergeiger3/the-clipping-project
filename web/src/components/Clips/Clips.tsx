import axios from "axios";
import { useEffect, useState } from "react";
import ClipCard from "./ClipCard";

export type Clip = {
  _id: string;
  url: string;
  start: number;
  end: number;
  output: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function useClips() {
  const [clips, setClips] = useState<Clip[]>();

  useEffect(() => {
    async function getClips(): Promise<void> {
      const clips = (await axios.get("http://localhost:3000/clips")).data
        .data as Clip[];
      setClips(clips);
    }
    getClips();
  }, []);

  return clips;
}

export default function Clips() {
  const clips = useClips();
  return clips ? (
    <>
      {clips.map((clip) => (
        <ClipCard key={clip._id} clip={clip} />
      ))}
    </>
  ) : null;
}
