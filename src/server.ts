import express from "express";
import { PORT } from "./config";
import userRoute from "./routes/auth.route";

const app = express();

app.use(express.json());

app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
