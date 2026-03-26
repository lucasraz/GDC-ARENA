# Directive: Scheduled Content Updates (NotebookLM & Search)
Automate site updates (News/Gallery) using AI orchestration at specific times.

## Intent
Keep the site fresh and authoritative without manual intervention by fetching, deduplicating, and formatting content from Vasco's ecosystem.

## Update Schedule
- **Morning (07:00):** Review press reports from the night/early morning.
- **Afternoon (15:00):** Mid-day news and training updates.
- **Night (22:00):** Post-match/Post-day wrap-up.

## Logic Implementation
1. **Search & Discovery (SearchTool):**
   - Query sites: `globoesporte.globo.com/futebol/times/vasco`, `lance.com.br/vasco`, `netvasco.com.br`.
   - Criteria: Main headlines of the day.
2. **Analysis & Deduplication (NotebookLM):**
   - Source: URLs/Text from discovered news.
   - Task: "Identify unique stories across these sources. Merge redundant content. Summarize with indications of all sources used."
3. **Gallery Updates:**
   - Search for image URLs from news/social feeds.
   - Extract alt-text and headlines for each image.
4. **Persistence (Layer 3):**
   - Store results in a JSON file or a local database (PostgreSQL/Supabase) to be rendered by the frontend.

## Quality Constraints
- **Multi-Source Attribution:** Every news item must list all sources where it was found.
- **No-Duplicate Rule:** If two sources cover the same event (e.g., "New signing"), merge them into one comprehensive update.
- **Tone:** Nautical Editorial (Professional, high-prestige, historical).
