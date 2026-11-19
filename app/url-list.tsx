
"use client";

import { useEffect, useState } from "react";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function UrlList({
    refreshKey,
  }: {
    refreshKey: number;
  }) {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    async function fetchUrls() {
      try {
        const response = await fetch("/api/urls");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load URLs.");
        }

        setUrls(data.urls);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUrls();
  }, [refreshKey]);

  async function handleCopy(id: string, shortUrl: string) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);

      setTimeout(() => {
        setCopiedId("");
      }, 2000);
    } catch {
      setError("Unable to copy the link.");
    }
  }

  return (
    <section className="space-y-5 rounded-lg border p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Your Links
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track all your shortened URLs.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-500">
          Loading your URLs...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && urls.length === 0 && (
        <p className="text-sm text-gray-500">
          You haven't created any shortened URLs yet.
        </p>
      )}

      {!loading && urls.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {urls.length} {urls.length === 1 ? "link" : "links"} created
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 font-medium">Original URL</th>
                  <th className="p-3 font-medium">Short URL</th>
                  <th className="p-3 font-medium">Clicks</th>
                  <th className="p-3 font-medium">Created</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {urls.map((url) => (
                  <tr key={url.id} className="border-b">
                    <td className="max-w-[200px] truncate p-3">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {url.originalUrl}
                      </a>
                    </td>

                    <td className="p-3">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {url.shortUrl}
                      </a>
                    </td>

                    <td className="p-3">{url.clicks}</td>

                    <td className="whitespace-nowrap p-3">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(url.id, url.shortUrl)
                        }
                        className="rounded-md border px-3 py-1.5 hover:bg-gray-100"
                      >
                        {copiedId === url.id ? "Copied!" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
