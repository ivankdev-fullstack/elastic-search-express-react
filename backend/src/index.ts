import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import { client } from "./elastic/client";
import { router as earthquakesRoutes } from "./retrieve-data";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use("/ingest_data", earthquakesRoutes);

app.get("/results", (req, res) => {
  const passedType = req.query.type;
  const passedMag = req.query.mag;
  const passedLocation = req.query.location;
  const passedDateRange = req.query.dateRange;
  const passedSortOption = req.query.sortOption;

  async function sendESRequest() {
    // @ts-ignore
    const body = await client.search({
      index: "earthquakes",
      body: {
        sort: [
          {
            mag: {
              order: passedSortOption,
            },
          },
        ],
        size: 300,
        query: {
          bool: {
            filter: [
              {
                term: { type: passedType },
              },
              {
                range: {
                  mag: {
                    gte: passedMag,
                  },
                },
              },
              {
                match: { place: passedLocation },
              },
              {
                range: {
                  "@timestamp": {
                    gte: `now-${passedDateRange}d/d`,
                    lt: "now/d",
                  },
                },
              },
            ],
          },
        },
      },
    });
    res.json(body.hits.hits);
  }
  sendESRequest();
});

app.listen(PORT, () => console.group(`Server started on ${PORT}`));
