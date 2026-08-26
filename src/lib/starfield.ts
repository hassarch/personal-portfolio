/**
 * Pure geometry helpers for the Starfield backdrop.
 *
 * Kept out of the component file so exporting them doesn't defeat React fast
 * refresh (which requires component modules to export only components).
 */

/**
 * Wraps a coordinate into [0, size) so parallax and drift offsets tile
 * seamlessly instead of leaving gaps at the edges of the field.
 *
 * Negative inputs wrap to the far end — that's what lets a star scrolled
 * "above" the field reappear at the bottom. A size of 0 (the pre-resize state)
 * passes the value through rather than producing NaN.
 */
export const wrapCoord = (value: number, size: number): number =>
  size > 0 ? ((value % size) + size) % size : value;
