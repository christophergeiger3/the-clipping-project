// Update the output file by installing orval:
// $ npm install -g orval
// then running:
// $ orval
// with the backend server running on http://localhost:4190.
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
