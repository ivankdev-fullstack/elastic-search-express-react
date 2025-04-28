/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import "./App.css";

interface FieldsTypes {
  type?: string;
  mag?: string;
  location?: string;
  date_range?: string;
  sort_option?: string;
  documents?: unknown[];
}

export const App = () => {
  const [fields, setFields] = useState<FieldsTypes>({});

  const sendSearchRequest = () => {
    const { type, mag, location, date_range, sort_option } = fields;

    const results = {
      method: "GET",
      url: "http://localhost:3333/results",
      params: {
        type,
        mag,
        location,
        dateRange: date_range,
        sortOption: sort_option,
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log(response.data);
        setFields((prev) => ({ ...prev, documents: response.data }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const disableButton = () => {
    return Object.values(fields).some(
      (v) => v === null || v === undefined || !v?.length
    );
  };

  return (
    <div className="app">
      <nav>
        <ul className="nav-bar">
          <li>Earthquake Watch</li>
        </ul>
      </nav>
      <p className="directions">
        {" "}
        Search for earthquakes using the following criteria:
      </p>
      <div className="main">
        <div className="type-selector">
          <ul>
            <li>
              <select
                name="types"
                id="types"
                value={fields.type}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option>Select a Type</option>
                <option value="earthquake">Earthquake</option>
                <option value="quarry blast">Quarry Blast</option>
                <option value="ice quake">Ice Quake</option>
                <option value="explosion">Explosion</option>
              </select>
            </li>
            <li>
              <select
                name="mag"
                id="mag"
                value={fields.mag}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, mag: e.target.value }))
                }
              >
                <option>Select magnitude level</option>
                <option value="2.5">2.5+</option>
                <option value="5.5">5.5+</option>
                <option value="6.1">6.1+</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
              </select>
            </li>
            <li>
              <form>
                <label>
                  <input
                    className="form"
                    type="text"
                    placeholder="Enter city, state, country"
                    value={fields.location}
                    onChange={(e) =>
                      setFields((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </label>
              </form>
            </li>
            <li>
              <select
                name="dateRange"
                id="dateRange"
                value={fields.date_range}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, date_range: e.target.value }))
                }
              >
                <option>Select date range</option>
                <option value="7">Past 7 Days</option>
                <option value="14">Past 14 Days</option>
                <option value="21">Past 21 Days</option>
                <option value="30">Past 30 Days</option>
              </select>
            </li>
            <li>
              <select
                name="sortOption"
                id="sortOption"
                value={fields.sort_option}
                onChange={(e) =>
                  setFields((prev) => ({
                    ...prev,
                    sort_option: e.target.value,
                  }))
                }
              >
                <option>Sort by</option>
                <option value="desc">Largest Magnitude First</option>
                <option value="asc">Smallest Magnitude First</option>
              </select>
            </li>
            <li>
              <button onClick={sendSearchRequest} disabled={disableButton()}>
                Search
              </button>
            </li>
          </ul>
        </div>
        {fields.documents && (
          <div className="search-results">
            {fields.documents.length > 0 ? (
              <p> Number of hits: {fields.documents.length}</p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p>
            )}
            {fields.documents.map((document: any) => (
              <div className="results-card">
                <div className="results-text">
                  <p>Type: {document?._source.type}</p>
                  <p>Time: {document?._source["@timestamp"]}</p>
                  <p>Location: {document?._source.place}</p>
                  <p>Latitude: {document?._source.coordinates.lat}</p>
                  <p>Longitude: {document?._source.coordinates.lon}</p>
                  <p>Magnitude: {document?._source.mag}</p>
                  <p>Depth: {document?._source.depth}</p>
                  <p>Significance: {document?._source.sig}</p>
                  <p>Event URL: {document?._source.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
