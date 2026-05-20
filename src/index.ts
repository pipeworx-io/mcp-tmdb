interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * TMDB v3 MCP.
 */


const BASE = 'https://api.themoviedb.org/3';
const UA = 'pipeworx-mcp-tmdb/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'configuration', description: 'Image config + change keys.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'search_movie',
    description: 'Movie search.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' }, year: { type: 'number' }, primary_release_year: { type: 'number' }, page: { type: 'number' }, language: { type: 'string' }, region: { type: 'string' }, include_adult: { type: 'boolean' } },
      required: ['query'],
    },
  },
  {
    name: 'search_tv',
    description: 'TV search.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, first_air_date_year: { type: 'number' }, year: { type: 'number' }, page: { type: 'number' }, language: { type: 'string' }, include_adult: { type: 'boolean' } }, required: ['query'] },
  },
  { name: 'search_person', description: 'Person search.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, page: { type: 'number' }, language: { type: 'string' }, include_adult: { type: 'boolean' } }, required: ['query'] } },
  { name: 'search_multi', description: 'Multi-type search.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, page: { type: 'number' }, language: { type: 'string' }, include_adult: { type: 'boolean' } }, required: ['query'] } },
  { name: 'movie', description: 'Movie detail.', inputSchema: { type: 'object', properties: { movie_id: { type: 'number' }, append_to_response: { type: 'string' }, language: { type: 'string' } }, required: ['movie_id'] } },
  { name: 'movie_credits', description: 'Cast/crew.', inputSchema: { type: 'object', properties: { movie_id: { type: 'number' }, language: { type: 'string' } }, required: ['movie_id'] } },
  { name: 'movie_videos', description: 'Trailers/clips.', inputSchema: { type: 'object', properties: { movie_id: { type: 'number' }, language: { type: 'string' } }, required: ['movie_id'] } },
  { name: 'movie_recommendations', description: 'Recommended movies.', inputSchema: { type: 'object', properties: { movie_id: { type: 'number' }, page: { type: 'number' }, language: { type: 'string' } }, required: ['movie_id'] } },
  { name: 'tv', description: 'TV show detail.', inputSchema: { type: 'object', properties: { tv_id: { type: 'number' }, append_to_response: { type: 'string' }, language: { type: 'string' } }, required: ['tv_id'] } },
  { name: 'tv_season', description: 'Season detail.', inputSchema: { type: 'object', properties: { tv_id: { type: 'number' }, season_number: { type: 'number' }, language: { type: 'string' } }, required: ['tv_id', 'season_number'] } },
  {
    name: 'tv_episode',
    description: 'Episode detail.',
    inputSchema: { type: 'object', properties: { tv_id: { type: 'number' }, season_number: { type: 'number' }, episode_number: { type: 'number' }, language: { type: 'string' } }, required: ['tv_id', 'season_number', 'episode_number'] },
  },
  { name: 'person', description: 'Person detail.', inputSchema: { type: 'object', properties: { person_id: { type: 'number' }, append_to_response: { type: 'string' }, language: { type: 'string' } }, required: ['person_id'] } },
  { name: 'person_combined_credits', description: 'Film + TV credits.', inputSchema: { type: 'object', properties: { person_id: { type: 'number' }, language: { type: 'string' } }, required: ['person_id'] } },
  {
    name: 'trending',
    description: 'Trending.',
    inputSchema: {
      type: 'object',
      properties: { media_type: { type: 'string', description: 'all | movie | tv | person' }, time_window: { type: 'string', description: 'day | week' }, page: { type: 'number' }, language: { type: 'string' } },
      required: ['media_type', 'time_window'],
    },
  },
  { name: 'discover_movie', description: 'Discover movies (passes through query params).', inputSchema: { type: 'object', properties: {}, additionalProperties: true } },
  { name: 'discover_tv', description: 'Discover TV.', inputSchema: { type: 'object', properties: {}, additionalProperties: true } },
  { name: 'genres_movie', description: 'Movie genres.', inputSchema: { type: 'object', properties: { language: { type: 'string' } } } },
  { name: 'genres_tv', description: 'TV genres.', inputSchema: { type: 'object', properties: { language: { type: 'string' } } } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('TMDB requires an API key. Set PLATFORM_TMDB_KEY or pass ?_apiKey=… (free non-commercial at https://www.themoviedb.org/settings/api).');
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams({ api_key: apiKey });
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && v != null) p.set(k, String(v));
    const res = await fetch(`${BASE}${path}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('TMDB: invalid API key.');
    if (!res.ok) throw new Error(`TMDB: ${res.status}`);
    return res.json();
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'configuration':
      return get('/configuration');
    case 'search_movie':
      return get('/search/movie', args);
    case 'search_tv':
      return get('/search/tv', args);
    case 'search_person':
      return get('/search/person', args);
    case 'search_multi':
      return get('/search/multi', args);
    case 'movie':
      return get(`/movie/${reqNum('movie_id', '550')}`, { append_to_response: args.append_to_response, language: args.language });
    case 'movie_credits':
      return get(`/movie/${reqNum('movie_id', '550')}/credits`, { language: args.language });
    case 'movie_videos':
      return get(`/movie/${reqNum('movie_id', '550')}/videos`, { language: args.language });
    case 'movie_recommendations':
      return get(`/movie/${reqNum('movie_id', '550')}/recommendations`, { page: args.page, language: args.language });
    case 'tv':
      return get(`/tv/${reqNum('tv_id', '1399')}`, { append_to_response: args.append_to_response, language: args.language });
    case 'tv_season':
      return get(`/tv/${reqNum('tv_id', '1399')}/season/${reqNum('season_number', '1')}`, { language: args.language });
    case 'tv_episode':
      return get(`/tv/${reqNum('tv_id', '1399')}/season/${reqNum('season_number', '1')}/episode/${reqNum('episode_number', '1')}`, { language: args.language });
    case 'person':
      return get(`/person/${reqNum('person_id', '500')}`, { append_to_response: args.append_to_response, language: args.language });
    case 'person_combined_credits':
      return get(`/person/${reqNum('person_id', '500')}/combined_credits`, { language: args.language });
    case 'trending':
      return get(`/trending/${encodeURIComponent(reqStr('media_type', '"all"'))}/${encodeURIComponent(reqStr('time_window', '"day"'))}`, { page: args.page, language: args.language });
    case 'discover_movie':
      return get('/discover/movie', args);
    case 'discover_tv':
      return get('/discover/tv', args);
    case 'genres_movie':
      return get('/genre/movie/list', { language: args.language });
    case 'genres_tv':
      return get('/genre/tv/list', { language: args.language });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
