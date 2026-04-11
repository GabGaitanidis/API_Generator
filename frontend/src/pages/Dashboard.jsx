import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [rules, setRules] = useState([]);
  const [urls, setUrls] = useState([]);
  const [formData, setFormData] = useState({
    endpoint: "",
    dataSchema: "",
    latency: 0,
    errorRate: 0,
  });
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchRules();
      fetchUrls();
    }
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("/api/rules");
      setRules(response.data.rules);
    } catch (err) {
      setError("Failed to fetch rules");
    }
  };

  const fetchUrls = async () => {
    try {
      const response = await axios.get("/api/dynamics");
      setUrls(response.data);
    } catch (err) {
      setError("Failed to fetch URLs");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitRule = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login first");
      return;
    }
    try {
      const dataSchema = JSON.parse(formData.dataSchema);
      await axios.post("/api/rules", { ...formData, dataSchema });
      fetchRules();
      setFormData({ endpoint: "", dataSchema: "", latency: 0, errorRate: 0 });
    } catch (err) {
      setError("Failed to create rule");
    }
  };

  const handleGenerateUrl = async () => {
    if (!user || !selectedRuleId) return;
    try {
      const response = await axios.post(`/api/dynamics/${selectedRuleId}`);
      setGeneratedUrl(response.data.url);
      fetchUrls();
    } catch (err) {
      setError("Failed to generate URL");
    }
  };

  const handleTestUrl = async () => {
    if (!generatedUrl) return;
    try {
      const response = await axios.get(
        generatedUrl.replace("http://localhost:5000", "/api"),
      );
      alert("Response: " + JSON.stringify(response.data, null, 2));
    } catch (err) {
      alert("Error: " + err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Mock API Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <div>
          <p className="mb-4">
            Welcome, {user.name}! Your API Key: {user.api_key}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Create Rule</h2>
              <form onSubmit={handleSubmitRule}>
                <div className="mb-4">
                  <label className="block text-gray-700">Endpoint</label>
                  <input
                    type="text"
                    name="endpoint"
                    value={formData.endpoint}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="/api/users"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Data Schema (JSON)
                  </label>
                  <textarea
                    name="dataSchema"
                    value={formData.dataSchema}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder='{"name": "person.fullName", "email": "internet.email"}'
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Latency (ms)</label>
                  <input
                    type="number"
                    name="latency"
                    value={formData.latency}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="30000"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Error Rate (%)</label>
                  <input
                    type="number"
                    name="errorRate"
                    value={formData.errorRate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded"
                >
                  Create Rule
                </button>
              </form>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Generate URL</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Select Rule</label>
                <select
                  value={selectedRuleId}
                  onChange={(e) => setSelectedRuleId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Choose a rule</option>
                  {rules.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.endpoint}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerateUrl}
                className="w-full bg-green-600 text-white p-2 rounded mb-4"
                disabled={!selectedRuleId}
              >
                Generate URL
              </button>
              {generatedUrl && (
                <div>
                  <p className="mb-2">Generated URL: {generatedUrl}</p>
                  <button
                    onClick={handleTestUrl}
                    className="w-full bg-purple-600 text-white p-2 rounded"
                  >
                    Test URL
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Your Rules</h2>
            <ul className="bg-white p-4 rounded shadow">
              {rules.map((rule) => (
                <li key={rule.id} className="mb-2">
                  {rule.endpoint} - Latency: {rule.latency}ms, Error Rate:{" "}
                  {rule.errorRate}%
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Your URLs</h2>
            <ul className="bg-white p-4 rounded shadow">
              {urls.map((url, index) => (
                <li key={index} className="mb-2">
                  {url.url}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>
          Please{" "}
          <a href="/login" className="text-blue-600">
            login
          </a>{" "}
          to access the dashboard.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
