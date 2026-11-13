
"use client";

import { useState } from "react";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function UrlForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] =
    useState<ShortenedUrl | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setShortenedUrl(null);
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setShortenedUrl(data.url);
      setOriginalUrl("");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shortenedUrl) return;

    try {
      await navigator.clipboard.writeText(shortenedUrl.shortUrl);
      setCopied(true);
    } catch {
      setError("Unable to copy the link. Please copy it manually.");
    }
  }

  return (
    <section className="space-y-5 rounded-lg border p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Shorten a URL
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Paste your long URL below to create a shorter link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="originalUrl"
          className="block text-sm font-medium"
        >
          Destination URL
        </label>

        <input
          id="originalUrl"
          type="url"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
          placeholder="https://example.com/your-long-url"
          required
          className="w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating link..." : "Shorten URL"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {shortenedUrl && (
        <div className="space-y-3 rounded-md bg-gray-100 p-4">
          <p className="font-medium text-green-700">
            URL shortened successfully!
          </p>

          <div>
            <p className="text-xs text-gray-500">
              YOUR SHORT LINK
            </p>
            <p className="break-all font-semibold">
              {shortenedUrl.shortUrl}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              ORIGINAL URL
            </p>
            <p className="break-all text-sm">
              {shortenedUrl.originalUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-gray-400 px-4 py-2 text-sm"
          >
            {copied ? "Copied!" : "Copy short link"}
          </button>
        </div>
      )}
    </section>
  );
}
