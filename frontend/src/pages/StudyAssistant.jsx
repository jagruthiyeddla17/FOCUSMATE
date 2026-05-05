import { useState } from "react";
import { API } from "../api";

export default function StudyAssistantPanel({ username, pushAlert }) {
  const [docPath, setDocPath] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadPDF(e) {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await API.post("/upload_pdf", form);
      setDocPath(res.data.path);
      setAnswer("");
      pushAlert(`Document uploaded successfully, ${username}`);
    } catch {
      pushAlert("Failed to upload document");
    }
  }

  async function askQuestion() {
    if (!docPath || !question) return;

    setLoading(true);
    try {
      const res = await API.post("/ask", {
        path: docPath,
        question,
      });
      setAnswer(res.data.answer);
    } catch {
      setAnswer("Unable to fetch answer from the document.");
    }
    setLoading(false);
  }

  return (
    <div className="card study-card">
      <div className="card-header">
        <strong>AI Study Assistant</strong>
      </div>

      {/* Upload */}
      <input
        type="file"
        accept=".pdf"
        onChange={uploadPDF}
        style={{
          marginBottom: 12,
          color: "#9aa4b2",
        }}
      />

      {/* Ask */}
      <input
        placeholder="Ask a question from your document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          background: "#0d1117",
          border: "1px solid #1f2937",
          color: "#e6edf3",
          marginBottom: 10,
        }}
      />

      <button
        onClick={askQuestion}
        disabled={loading}
        className="btn"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {/* Answer */}
      {answer && (
        <div
          style={{
            marginTop: 14,
            fontSize: 14,
            color: "#c9d1d9",
            lineHeight: 1.6,
          }}
        >
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
