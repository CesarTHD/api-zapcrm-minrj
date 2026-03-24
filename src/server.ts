import Express from "express";
import cors from "cors";
import segments from "./routes/segments";
import campaignRoutes from "./routes/campaign";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const PORT = process.env.PORT || 3000;

const app = Express();

app.use(cors());
app.use(Express.json());

app.use("/segments", segments);
app.use("/campaigns", campaignRoutes);

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});