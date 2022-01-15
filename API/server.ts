import express from "express";
import { Client } from "discord.js";

export default function server() {
  const app = express();

  app.use(
    (
      _req: any,
      res: { send: (arg0: { message: string }) => void },
      next: () => void
    ) => {
      res.send({ message: "Hello World" });
      next();
    }
  );

  app.listen(5555, () => console.log("localhost:5555"));
}
