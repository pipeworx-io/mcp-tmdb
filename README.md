# @pipeworx/tmdb

[The Movie Database (TMDB) v3](https://developer.themoviedb.org/) MCP — film + TV + people. Free key (non-commercial use).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1857+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

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

Both URLs reach the same gateway and the same 1857+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/configuration`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-tmdb` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/tmdb/mcp` endpoint shown above. It needs network access;
there is no offline mode.

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

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

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
