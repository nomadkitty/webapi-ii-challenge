const express = require("express");
const postsRouter = require("./posts/posts-router");

const server = express();

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

server.listen(8000, () => {
  console.log("\n*** Server Running on http://localhost:8000 ***\n");
});
