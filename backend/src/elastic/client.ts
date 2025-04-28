import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const { ELASTIC_CLOUD_ID, ELASTIC_API_KEY } = process.env;

if (!ELASTIC_CLOUD_ID || !ELASTIC_API_KEY) {
  throw new Error("Missing Elasticsearch environment variables");
}

export const client = new Client({
  cloud: {
    id: ELASTIC_CLOUD_ID,
  },
  auth: {
    apiKey: ELASTIC_API_KEY,
  },
});

client
  .ping()
  .then(() => console.log("You are connected to Elasticsearch!"))
  .catch((err) => console.error("Elasticsearch is not connected:", err));
