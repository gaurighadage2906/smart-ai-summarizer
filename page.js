
"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    setError("");
    setSummary("");

    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, length })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSummary(data.summary);

    } catch (err) {
      setError(err.message || "Unable to generate summary.");
    } finally {
      setLoading(false);
    }
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      setError("Unable to copy summary.");
    }
  }

  function clearAll() {
    setText("");
    setSummary("");
    setError("");
  }

  return (
    <main className="container">

      <nav className="navbar">
        <div className="logo">✦ SmartSummarizer</div>
        <span className="nav-label">DEMO MODE</span>
      </nav>

      <section className="hero">
        <div className="tag">YOUR TEXT SUMMARIZER</div>

        <h1>
          Turn Long Text Into
          <span> Clear Insights.</span>
        </h1>

        <p>
          Summarize articles, notes and documents
          with our text summarization demo.
        </p>
      </section>

      <section className="workspace">

        <div className="panel">

          <div className="panel-heading">
            <h2>Enter Your Text</h2>
            <span>{text.length}/12000</span>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your article, notes or document here..."
            maxLength={12000}
            disabled={loading}
          />

          <div className="controls">

            <div className="length-control">
              <label htmlFor="length">Summary Length</label>

              <select
                id="length"
                value={length}
                onChange={e => setLength(e.target.value)}
                disabled={loading}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <button
              className="clear-button"
              onClick={clearAll}
              disabled={loading}
            >
              Clear
            </button>

          </div>

          <button
            className="summarize-button"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? "Generating..." : "✦ Generate Summary"}
          </button>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

        </div>

        <div className="panel result-panel">

          <div className="panel-heading">
            <h2>Summary Result</h2>

            {summary && (
              <button
                className="copy-button"
                onClick={copySummary}
              >
                Copy
              </button>
            )}
          </div>

          <div className="summary-content" aria-live="polite">
            {summary || "Your summary will appear here..."}
          </div>

          {summary && (
            <p className="demo-note">
              Demo mode: extractive summary, not AI-generated.
            </p>
          )}

        </div>

      </section>

      <footer>
        SmartSummarizer © 2026 | Built with Next.js
      </footer>

    </main>
  );
}
