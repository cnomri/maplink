import { NextRequest, NextResponse } from "next/server";

const DOMAIN = process.env.JIRA_DOMAIN!;
const EMAIL  = process.env.JIRA_EMAIL!;
const TOKEN  = process.env.JIRA_API_TOKEN!;

function extract(adf: any, needle: string) {
  const hits: {text:string; href:string}[] = [];
  const walk = (n:any) => {
    if (Array.isArray(n)) n.forEach(walk);
    else if (n && typeof n === "object") {
      if (n.type === "text" && n.marks) {
        for (const m of n.marks) {
          if (m?.type === "link") {
            const href = m.attrs?.href || "";
            if (href.includes(needle)) hits.push({ text: n.text || "(link)", href });
          }
        }
      }
      Object.values(n).forEach(walk);
    }
  };
  if (adf) walk(adf);
  return hits;
}

async function runSearch(uuid: string, filterId?: string) {
  const base = `https://${DOMAIN}/rest/api/3/search`;
  const passes = ["description", "text"];
  const out: any[] = [];

  for (const field of passes) {
    let startAt = 0;
    for (;;) {
      const parts = [];
      if (filterId) parts.push(`filter = ${filterId}`);
      parts.push(`${field} ~ "\\"${uuid}\\""`); // quote escaping for JQL
      const jql = parts.join(" AND ");

      const url = new URL(base);
      url.searchParams.set("jql", jql);
      url.searchParams.set("fields", "summary,description");
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("startAt", String(startAt));

      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Authorization": "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64")
        },
        cache: "no-store"
      });

      if (res.status === 400 && field === "description") break;
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      for (const issue of (data.issues || [])) {
        const desc = issue.fields?.description;
        for (const link of extract(desc, uuid)) {
          out.push({
            issueKey: issue.key,
            summary: issue.fields?.summary || "",
            siteName: link.text,
            url: link.href
          });
        }
      }

      const total = data.total ?? 0;
      const maxr  = data.maxResults ?? 50;
      startAt += maxr;
      if (startAt >= total) break;
    }
    if (out.length) break;
  }
  return out;
}

export async function GET(req: NextRequest) {
  const uuid = req.nextUrl.searchParams.get("baseMapUUID")?.trim();
  const filterId = req.nextUrl.searchParams.get("filterId")?.trim() || undefined;
  if (!DOMAIN || !EMAIL || !TOKEN)
    return new NextResponse("Server not configured (env vars missing).", { status: 500 });
  if (!uuid) return new NextResponse("baseMapUUID is required", { status: 400 });

  try {
    const hits = await runSearch(uuid, filterId);
    if (!hits.length) return new NextResponse("No matching links found.", { status: 404 });
    return NextResponse.json(hits);
  } catch (e: any) {
    return new NextResponse(e.message || "Upstream error", { status: 502 });
  }
}
