import { useState, useEffect } from 'react';

export interface AnimeEntry {
  id: number;
  title: string;
  coverImage: string;
  progress: number;
  totalEpisodes: number | null;
  status: 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'PAUSED' | 'DROPPED';
  score: number;
}

interface AniListResponse {
  data: {
    MediaListCollection: {
      lists: Array<{
        entries: Array<{
          id: number;
          progress: number;
          score: number;
          status: string;
          media: {
            id: number;
            title: {
              english: string | null;
              romaji: string;
            };
            coverImage: {
              large: string;
            };
            episodes: number | null;
          };
        }>;
      }>;
    };
  };
}

export const useAniList = (username: string) => {
  const [watching, setWatching] = useState<AnimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAniList = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch only CURRENT (watching) status
        const query = `
          query ($username: String) {
            MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
              lists {
                entries {
                  id
                  progress
                  score
                  status
                  media {
                    id
                    title {
                      english
                      romaji
                    }
                    coverImage {
                      large
                    }
                    episodes
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { username },
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const data: AniListResponse = await response.json();
        
        const animeList: AnimeEntry[] = [];
        data.data.MediaListCollection.lists.forEach(list => {
          list.entries.forEach(entry => {
            animeList.push({
              id: entry.media.id,
              title: entry.media.title.english || entry.media.title.romaji,
              coverImage: entry.media.coverImage.large,
              progress: entry.progress,
              totalEpisodes: entry.media.episodes,
              status: entry.status as AnimeEntry['status'],
              score: entry.score,
            });
          });
        });

        setWatching(animeList);
      } catch (err) {
        console.error('Error fetching AniList:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchAniList();
    }
  }, [username]);

  return { watching, loading, error };
};
