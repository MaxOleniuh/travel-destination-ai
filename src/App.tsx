import { type FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authToken: outputs.data.api_key,
});
console.log(outputs);

function App() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const { data, errors } = await amplifyClient.queries.askBedrock({
        interests: [formData.get("interests")?.toString() || ""],
      });

      if (errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="">
        <h1 className="">
          Meet Your Personal <br />
          <span className="text-3xl font-bold">
            Travel Destination Generator
          </span>
        </h1>
        <p className="text-gray-800 font-semibold">
          Simply type a few interest using the format interest1, interest2,
          etc... and the generator will comback with
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="interests"
            name="interests"
            placeholder="interest1, interest2, interest3, ...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>

      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;
