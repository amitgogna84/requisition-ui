import { useState } from "react";
import axios from "axios";

export default function RequisitionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post("http://localhost:3000/requisition", {
        title,
        description,
        budget,
      });
      setResponse(res.data.enrichedJD);
    } catch (error: any) {
      setResponse("Error submitting form. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Requisition</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Budget</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">AI Enriched JD:</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}