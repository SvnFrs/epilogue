import { z } from 'zod';

/**
 * Closed taxonomy (constitution: closed status set; fixed-space nav FR-019/020).
 * These four families drive the polymorphic VolatileContext (data-model.md).
 */

export const MEDIA_TYPES = ['GAME', 'BOOK', 'MANGA', 'FILM', 'SERIES', 'ANIME', 'TECH_LOG'] as const;
export const SPACES = ['gaming', 'reading', 'cinema', 'tech'] as const;
export const STATUSES = ['PLAYING', 'PAUSED', 'READING', 'COMPLETED', 'AIRING'] as const;
export const FAMILIES = ['game', 'reading', 'screen', 'tech'] as const;

export const MediaType = z.enum(MEDIA_TYPES);
export const Space = z.enum(SPACES);
export const Status = z.enum(STATUSES);
export const Family = z.enum(FAMILIES);

export type MediaType = z.infer<typeof MediaType>;
export type Space = z.infer<typeof Space>;
export type Status = z.infer<typeof Status>;
export type Family = z.infer<typeof Family>;

/** media_type → space (data-model.md validation rule). */
export const MEDIA_TYPE_TO_SPACE: Record<MediaType, Space> = {
  GAME: 'gaming',
  BOOK: 'reading',
  MANGA: 'reading',
  FILM: 'cinema',
  SERIES: 'cinema',
  ANIME: 'cinema',
  TECH_LOG: 'tech',
};

/** media_type → context family (data-model.md). */
export const MEDIA_TYPE_TO_FAMILY: Record<MediaType, Family> = {
  GAME: 'game',
  BOOK: 'reading',
  MANGA: 'reading',
  FILM: 'screen',
  SERIES: 'screen',
  ANIME: 'screen',
  TECH_LOG: 'tech',
};

export function spaceForMediaType(mediaType: MediaType): Space {
  return MEDIA_TYPE_TO_SPACE[mediaType];
}

export function familyForMediaType(mediaType: MediaType): Family {
  return MEDIA_TYPE_TO_FAMILY[mediaType];
}
