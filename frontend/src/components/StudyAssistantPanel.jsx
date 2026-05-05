import { useState } from "react";

/* ------------------ FAKE DOCUMENT CONTENT ------------------ */
const DOCUMENT_CONTENT = `
The Internet of Things (IoT) is a system of interconnected physical devices embedded with sensors,
software, and connectivity that enables data collection and exchange over the internet.

IoT architecture consists of perception, network, and application layers.
Sensors such as temperature, humidity, motion, and gas sensors are widely used.
Protocols like MQTT, HTTP, CoAP, and LoRaWAN enable communication.
Security challenges include data privacy, authentication, and secure communication.

IoT applications include smart homes, healthcare monitoring, industrial automation,
agriculture, and smart cities.
`;

const ANSWERS = [
  {
    keywords: ["iot", "internet of things"],
    answer: `
According to the uploaded document, the Internet of Things (IoT) refers to a network of
interconnected physical devices embedded with sensors and software that allow them
to collect and exchange data over the internet.

The document highlights IoT as a key enabler of smart environments and automation.
    `,
  },
  {
    keywords: ["architecture"],
    answer: `
As mentioned in the document, IoT architecture is divided into three main layers:

1. Perception Layer – responsible for sensing physical parameters.
2. Network Layer – handles data transmission using communication protocols.
3. Application Layer – provides user-facing services and analytics.

This layered architecture ensures scalability and modularity.
    `,
  },
  {
    keywords: ["protocol"],
    answer: `
The uploaded document describes several IoT communication protocols such as MQTT,
HTTP, CoAP, and LoRaWAN.

These protocols are designed to support lightweight communication, low power
consumption, and reliable data transfer in constrained environments.
    `,
  },
  {
    keywords: ["security"],
    answer: `
According to the document, IoT security is a major challenge due to large-scale deployment
and limited device resources.

Security concerns include data privacy, authentication, and secure communication,
which must be addressed using encryption and secure access mechanisms.
    `,
  },
  {
    keywords: ["application"],
    answer: `
The document outlines multiple IoT applications including smart homes, healthcare systems,
industrial automation, agriculture monitoring, and smart city infrastructure.

These applications demonstrate the versatility of IoT technology.
    `,
  },
];

/* ------------------ COMPONENT ------------------ */
export default function StudyAssistantPanel({ username }) {
  const [pdfName, setPdfName] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loaded, setLoaded] = useState(false);

  function uploadPDF(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPdfName(file.name);
    setLoaded(true);
    setChat([]);

    setChat([
      {
        q: null,
        a: `Document "${file.name}" has been successfully loaded.
You may now ask questions related to the content.`,
      },
    ]);
  }

  function findAnswer(q) {
    const qLower = q.toLowerCase();
    for (const item of ANSWERS) {
      if (item.keywords.some((k) => qLower.includes(k))) {
        return item.answer;
      }
    }

    return `
Based on the uploaded document, the topic relates to IoT concepts such as sensors,
communication protocols, architecture, and applications.

Please refine your question to focus on a specific concept mentioned in the document.
    `;
  }

  function askQuestion() {
    if (!question.trim()) return;

    const answer = findAnswer(question);

    setChat((c) => [...c, { q: question, a: answer }]);
    setQuestion("");
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
        style={{ marginBottom: 12, color: "#9aa4b2" }}
      />

      {loaded && (
        <div style={{ fontSize: 12, color: "#42c9ff", marginBottom: 10 }}>
          📄 Loaded Document: {pdfName}
        </div>
      )}

      {/* Chat */}
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {chat.map((item, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            {item.q && (
              <div style={{ color: "#9aa4b2", marginBottom: 4 }}>
                <strong>You:</strong> {item.q}
              </div>
            )}
            <div style={{ color: "#c9d1d9", whiteSpace: "pre-wrap" }}>
              <strong>Assistant:</strong> {item.a}
            </div>
          </div>
        ))}
      </div>

      {/* Ask */}
      {loaded && (
        <>
          <input
            placeholder="Ask a question from the document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              background: "#0d1117",
              border: "1px solid #1f2937",
              color: "#e6edf3",
              marginTop: 10,
            }}
          />

          <button className="btn" onClick={askQuestion} style={{ marginTop: 8 }}>
            Ask
          </button>
        </>
      )}
    </div>
  );
}
