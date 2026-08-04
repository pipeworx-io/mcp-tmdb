# @pipeworx/tmdb

[The Movie Database (TMDB) v3](https://developer.themoviedb.org/) MCP — film + TV + people. Free key (non-commercial use).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Tmdb data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
