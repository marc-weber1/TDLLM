import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes";

dotenv.config();

try {
  const required_vars = [
    "MEMORY_LIMIT",
    "TIME_LIMIT",
    "MAX_ITERATIONS",
    "OPENAI_MODEL",
    "OPENAI_KEY",
  ];

  const missing_vars = required_vars.filter((v) => !process.env[v]);

  if (missing_vars.length > 0)
    throw new Error(
      `The following environment variables must be defined: ${missing_vars.join(", ")}`
    );
} catch (error) {
  console.error(error);
  process.exit(1);
}

const app = express();
const PORT = +(process.env.PORT || 3000);

const jsonErrorHandler: ErrorRequestHandler = (err, _, res, __) => res.status(500).send(err);

app.use(express.json());
app.use(cors()); // allow all requests
app.use(jsonErrorHandler);
app.use("/", routes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
