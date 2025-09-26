import { type FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Meet Your Personal <br />
          <span className="text-indigo-600">Travel Destination Generator</span>
        </h1>
        <p className="mt-4 text-gray-700 font-medium">
          Simply type a few interests in the format{" "}
          <span className="italic">interest1, interest2, etc.</span> and the
          generator will come back with a recommendation.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            id="interests"
            name="interests"
            placeholder="interest1, interest2, interest3, ..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Generate
          </button>
        </div>
      </form>

      {/* Result / Loader */}
      <div className="w-full max-w-xl mt-6">
        {loading ? (
          <div className="flex flex-col items-center space-y-4 p-4 bg-white shadow-md rounded-lg">
            <p className="text-gray-600 font-medium">Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && (
            <div className="p-4 bg-white shadow-md rounded-lg text-gray-800 font-medium">
              {result}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
