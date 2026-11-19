
"use client";

import { useState } from "react";
import UrlForm from "./url-form";
import UrlList from "./url-list";

export default function UrlDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleUrlCreated() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="space-y-6">
      <UrlForm onUrlCreated={handleUrlCreated} />

      <UrlList refreshKey={refreshKey} />
    </div>
  );
}
