import * as z from "zod";
import { Card, Exhibit, User, Image } from "@prisma/client";

/**
 * This represents a `Card` in the database. It should be used in place of the
 * `Card` type from `"@prisma/client"`.This version overrides the `summary`
 * field to be a string rather than a `Prisma.JsonValue`, which is very tedious
 * to work with.
 */
export type CardType = Card & { description: string };

/**
 * This represents a `Exhibit` in the database. It should be used in place of the
 * `Exhibit` type from `"@prisma/client"`. This version overrides the `summary`
 * field to be a string rather than a `Prisma.JsonValue`, which is very tedious
 * to work with.
 */
export type ExhibitType = Exhibit & { summary: string };

/**
 * This represents an `Image` in the database. It should be used in place of the
 * `Image` type from `"@prisma/client"`, because `Image` also refers to the `Image`
 * component from `"next/image"`.
 */
export type ImageType = Image;

/**
 * This represents a `User` in the database. It should be used in place of the
 * `User` type from `"@prisma/client"`, for consistency with the other types.
 */
export type UserType = User;

/**
 * Parses to `UserType`, *not* `User` from `"@prisma/client"`.
 */
export const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isMaster: z.boolean()
});

/**
 * Parses to `ExhibitType`, *not* `Exhibit` from `"@prisma/client"`.
 */
export const ExhibitSchema = z.object({
  id: z.number(),
  priority: z.number(),
  title: z.string(),
  thumbnail: z.string(),
  summary: z.string(),
  published: z.boolean()
});

/**
 * Parses to `CardType`, which is identical to `Card` from `"@prisma/client"`.
 */
export const CardSchema = z.object({
  id: z.number(),
  exhibitId: z.number(),
  description: z.string(),
  media: z.string()
});

/**
 * Parses to `ImageType`, which is identical to `Image` from `"@prisma/client"`.
 */
export const ImageSchema = z.object({
  url: z.string()
});
