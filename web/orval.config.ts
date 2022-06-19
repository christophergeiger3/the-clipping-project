// Update the output file by running:
// $ orval
// with the backend server running on http://localhost:4190.
// If you are actively developing the backend, try:
// $ orval --watch
const orvalConfig = {
  apiSpec: {
    input: {
      target: "http://localhost:4190/api-json",
    },
    output: {
      target: "./src/api.ts",
      client: "react-query",
    },
  },
};

export default orvalConfig;
