import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import { makeDb } from "./db/connect";
import customerRouter from "./routes/index";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config({ path: "../config.env" });

/** Instantiating database */
export let db: any;

(async function () {
  db = await makeDb();
})();

app.use(morgan("dev"));

app.use("/api/v1", customerRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}..........`);
});
