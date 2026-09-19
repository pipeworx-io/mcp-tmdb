# @pipeworx/tmdb

[The Movie Database (TMDB) v3](https://developer.themoviedb.org/) MCP — film + TV + people. Free key (non-commercial use).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1576+ live data sources.

## Auth

- Platform: `PLATFORM_TMDB_KEY`. BYO: `?_apiKey=…`.

## Tools

- `configuration()` — image config + change keys
- `search_movie(query, year?, primary_release_year?, page?, language?, region?, include_adult?)` — movie search
- `search_tv(query, first_air_date_year?, year?, page?, language?, include_adult?)` — TV search
- `search_person(query, page?, language?, include_adult?)` — person search
- `search_multi(query, page?, language?, include_adult?)` — multi-type search
- `movie(movie_id, append_to_response?, language?)` — movie detail
- `movie_credits(movie_id, language?)` — cast/crew
- `movie_videos(movie_id, language?)` — trailers/clips
- `movie_recommendations(movie_id, page?, language?)` — recommended movies
- `tv(tv_id, append_to_response?, language?)` — TV show detail
- `tv_season(tv_id, season_number, language?)` — season detail
- `tv_episode(tv_id, season_number, episode_number, language?)` — episode detail
- `person(person_id, append_to_response?, language?)` — person detail
- `person_combined_credits(person_id, language?)` — film + TV credits
- `trending(media_type, time_window, page?, language?)` — trending
- `discover_movie(...)` — discover movies (passes through query params)
- `discover_tv(...)` — discover TV
- `genres_movie(language?)` — movie genres
- `genres_tv(language?)` — TV genres

## Data source

`https://api.themoviedb.org/3`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "tmdb": {
      "url": "https://gateway.pipeworx.io/tmdb/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/tmdb/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1576+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/configuration`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "tmdb": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-tmdb"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-tmdb
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Tmdb data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
