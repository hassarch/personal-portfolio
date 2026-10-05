import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import SpotifyPlayer from './SpotifyPlayer';

const TRACK = {
  name: 'Teardrop',
  artist: 'Massive Attack',
  album: 'Mezzanine',
  imageUrl: 'https://i.scdn.co/image/abc',
  isPlaying: true,
  progress: 0,
  duration: 200_000,
  spotifyUrl: 'https://open.spotify.com/track/abc',
};

/** The player reads everything through the proxy, so one stub covers it. */
const mockProxy = (init: { status: number; body?: unknown }) => {
  const fetchMock = vi.fn().mockResolvedValue({
    status: init.status,
    ok: init.status >= 200 && init.status < 300,
    json: async () => init.body,
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('SpotifyPlayer', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('shows a skeleton while the first request is in flight', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));

    const { container } = render(<SpotifyPlayer />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders the track returned by the proxy', async () => {
    mockProxy({ status: 200, body: TRACK });

    render(<SpotifyPlayer />);

    expect(await screen.findByText('Teardrop')).toBeInTheDocument();
    expect(screen.getByText('Massive Attack')).toBeInTheDocument();
    expect(screen.getByAltText('Mezzanine')).toHaveAttribute('src', TRACK.imageUrl);
    expect(screen.getByText('$ spotify --now-playing')).toBeInTheDocument();
  });

  it('labels a non-playing track as last played', async () => {
    mockProxy({ status: 200, body: { ...TRACK, isPlaying: false } });

    render(<SpotifyPlayer />);

    expect(await screen.findByText('$ spotify --last-played')).toBeInTheDocument();
  });

  it('shows offline when the proxy reports nothing to play', async () => {
    mockProxy({ status: 204 });

    render(<SpotifyPlayer />);

    expect(await screen.findByText('[ offline ]')).toBeInTheDocument();
  });

  it('shows an error when the proxy fails with nothing cached', async () => {
    mockProxy({ status: 503, body: { error: 'spotify_unavailable' } });

    render(<SpotifyPlayer />);

    expect(await screen.findByText('[ error ]')).toBeInTheDocument();
  });

  it('keeps the last good track when a later poll fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, ok: true, json: async () => TRACK })
      .mockResolvedValue({ status: 503, ok: false, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    render(<SpotifyPlayer />);
    expect(await screen.findByText('Teardrop')).toBeInTheDocument();

    // Returning to the tab triggers an immediate refetch, which fails here.
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Teardrop')).toBeInTheDocument();
    expect(screen.queryByText('[ error ]')).not.toBeInTheDocument();
  });

  it('advances progress locally between polls', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockProxy({ status: 200, body: TRACK });

    render(<SpotifyPlayer />);
    expect(await screen.findByText('0:00 / 3:20')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3_000);
    });

    expect(screen.getByText('0:03 / 3:20')).toBeInTheDocument();
  });

  it('renders the transport row as decoration, not controls', async () => {
    mockProxy({ status: 200, body: TRACK });

    const { container } = render(<SpotifyPlayer />);
    await screen.findByText('Teardrop');

    // The only buttons in the tile belong to the terminal frame's window
    // chrome — the transport glyphs must not be interactive, since they would
    // otherwise act on a real account from a public page.
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach((button) => expect(button).toHaveClass('macos-btn'));

    for (const label of ['Play', 'Pause', 'Next', 'Previous', 'Like']) {
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
    }
  });

  it('links the artwork and title out to Spotify', async () => {
    mockProxy({ status: 200, body: TRACK });

    render(<SpotifyPlayer />);
    await screen.findByText('Teardrop');

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', TRACK.spotifyUrl);
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
