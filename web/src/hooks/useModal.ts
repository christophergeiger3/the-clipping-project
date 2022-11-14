import { useCallback, useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return { open, handleOpen, handleClose };
}
