# MapLink Finder (Next.js on Vercel)

Find Jira issues whose **Description** contains a map URL with a given `baseMapUUID` and extract the embedded link (e.g., "Pontiac Central").

## Deploy (no local dev)
1. Create a new GitHub repo and add these files.
2. On Vercel: **New Project** → import the repo.
3. Set **Environment Variables**:
   - `JIRA_DOMAIN` = `mobileye-perfects.atlassian.net`
   - `JIRA_EMAIL` = your Atlassian email
   - `JIRA_API_TOKEN` = your Jira API token (store securely)
4. Deploy. Open the URL and search by `baseMapUUID`.

## Local dev (optional)
```bash
npm install
npm run dev
# open http://localhost:3000
```
