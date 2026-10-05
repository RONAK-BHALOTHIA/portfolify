import JSZip from "jszip";
import { NextResponse } from "next/server";
import { POST as buildExport } from "@/app/api/export/route";

export const runtime = "nodejs";

const GH = "https://api.github.com";

async function gh(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
  });
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  try {
    const { token, repoName, isPrivate, templateId, data } = await req.json();

    if (typeof token !== "string" || token.length < 20) {
      return NextResponse.json({ error: "Enter a valid GitHub token." }, { status: 400 });
    }
    if (typeof repoName !== "string" || !/^[A-Za-z0-9._-]{1,100}$/.test(repoName)) {
      return NextResponse.json(
        { error: "Repo name can only use letters, numbers, dots, dashes, and underscores." },
        { status: 400 }
      );
    }

    // 1. Build the project using the existing export route
    const exportRes = await buildExport(
      new Request("http://localhost/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, data }),
      })
    );
    if (!exportRes.ok) {
      const j = await exportRes.json().catch(() => ({}));
      return NextResponse.json({ error: j.error || "Could not build the project." }, { status: 400 });
    }

    // 2. Read the files out of the ZIP (drop the top-level folder name)
    const zip = await JSZip.loadAsync(await exportRes.arrayBuffer());
    const files: { path: string; content: string }[] = [];
    for (const [name, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      files.push({ path: name.split("/").slice(1).join("/"), content: await entry.async("string") });
    }

    // 3. Create the repository
    const created = await gh(token, "/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name: repoName,
        description: "Portfolio generated with Portfolify",
        private: Boolean(isPrivate),
        auto_init: true,
      }),
    });
    if (created.res.status === 401) {
      return NextResponse.json({ error: "GitHub rejected the token. Check it and its 'repo' scope." }, { status: 401 });
    }
    if (created.res.status === 422) {
      return NextResponse.json({ error: "A repository with that name already exists. Pick another name." }, { status: 422 });
    }
    if (!created.res.ok) {
      return NextResponse.json({ error: created.json.message || "Could not create the repository." }, { status: 502 });
    }

    const owner: string = created.json.owner.login;
    const repo: string = created.json.name;
    const branch: string = created.json.default_branch;
    const base = `/repos/${owner}/${repo}`;

    // 4. Wait for the initial commit (auto_init can take a moment)
    let headSha = "";
    for (let i = 0; i < 6 && !headSha; i++) {
      const ref = await gh(token, `${base}/git/ref/heads/${branch}`);
      if (ref.res.ok) headSha = ref.json.object.sha;
      else await sleep(800);
    }
    if (!headSha) {
      return NextResponse.json(
        { error: `Repo was created but is not ready yet. Open it here: ${created.json.html_url}` },
        { status: 502 }
      );
    }

    const headCommit = await gh(token, `${base}/git/commits/${headSha}`);
    const baseTree: string = headCommit.json.tree.sha;

    // 5. Create one tree with all the files, one commit, and move the branch
    const tree = await gh(token, `${base}/git/trees`, {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTree,
        tree: files.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.content })),
      }),
    });
    if (!tree.res.ok) {
      return NextResponse.json({ error: tree.json.message || "Could not upload files." }, { status: 502 });
    }

    const commit = await gh(token, `${base}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message: "Add portfolio generated with Portfolify",
        tree: tree.json.sha,
        parents: [headSha],
      }),
    });
    if (!commit.res.ok) {
      return NextResponse.json({ error: commit.json.message || "Could not create the commit." }, { status: 502 });
    }

    const update = await gh(token, `${base}/git/refs/heads/${branch}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.json.sha }),
    });
    if (!update.res.ok) {
      return NextResponse.json({ error: update.json.message || "Could not update the branch." }, { status: 502 });
    }

    return NextResponse.json({ url: created.json.html_url });
  } catch (err) {
    console.error("GitHub push error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Push failed. Check the terminal for details." }, { status: 500 });
  }
}