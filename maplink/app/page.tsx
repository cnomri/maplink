"use client";
import { useState } from "react";

type Hit = { issueKey: string; summary: string; siteName: string; url: string };

export default function Page() {
  const [uuid, setUuid] = useState("");
  const [filterId, setFilterId] = useState("10724");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null); setHits(null);
    try {
      const q = new URLSearchParams({
        baseMapUUID: uuid.trim(),
        ...(filterId ? { filterId } : {})
      }).toString();
      const resp = await fetch(`/api/maplink?${q}`);
      if (!resp.ok) throw new Error(await resp.text());
      setHits(await resp.json());
    } catch (e: any) {
      setError(e.message || "Request failed");
    } finally { setLoading(false); }
  };

  return (
    <main style={{maxWidth: 720, margin: "2rem auto"}}>
      <h1>Find Map Link by baseMapUUID</h1>
      <label>baseMapUUID</label>
      <input
        value={uuid}
        onChange={e=>setUuid(e.target.value)}
        placeholder="e37ef977-bd53-4381-a9ed-12fc6a5d8262"
        style={{width:"100%", padding:8, marginTop:6}}
      />
      <div style={{display:"flex", gap:12, alignItems:"center", marginTop:12}}>
        <label>Filter ID (optional)</label>
        <input value={filterId} onChange={e=>setFilterId(e.target.value)} style={{padding:6}}/>
        <button onClick={run} disabled={!uuid || loading} style={{padding:"8px 12px"}}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p style={{color:"crimson", marginTop:16, whiteSpace:"pre-wrap"}}>{error}</p>}
      {hits && hits.length===0 && <p style={{marginTop:16}}>No matches.</p>}
      {hits && hits.length>0 && (
        <ul style={{marginTop:16, lineHeight:1.6}}>
          {hits.map((h, i) => (
            <li key={i}>
              <strong>{h.issueKey}</strong> — {h.summary} — <em>{h.siteName}</em>{" "}
              → <a href={h.url} target="_blank" rel="noreferrer">Open map</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
