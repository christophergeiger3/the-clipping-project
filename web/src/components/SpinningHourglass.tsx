import { HourglassFullTwoTone } from "@mui/icons-material";

export const SpinningHourglass = ({ ...props }) => (
  <HourglassFullTwoTone
    color="info"
    sx={{
      animation: "spin 2s linear infinite",
      "@keyframes spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    }}
    {...props}
  />
);
