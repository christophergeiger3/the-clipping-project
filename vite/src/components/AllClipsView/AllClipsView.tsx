import { useClipsControllerFindAll } from "@/api";

export default function AllClipsView() {
  const { data: response } = useClipsControllerFindAll();
  const clips = response?.data;

  return (
    <div>
      <h1>All Clips</h1>
      <pre>{JSON.stringify(clips, null, 2)}</pre>
    </div>
  );
}
