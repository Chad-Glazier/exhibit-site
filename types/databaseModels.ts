import * as z from "zod";
import { Card, Exhibit, User, Image } from "@prisma/client";

export type CardType = Card & { description: string };
export type ExhibitType = Exhibit & { summary: string };
export type ImageType = Image;
export type UserType = User;

export const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isMaster: z.boolean()
});

export const ExhibitSchema = z.object({
  id: z.number(),
  title: z.string(),
  thumbnail: z.string(),
  summary: z.string(),
  published: z.boolean()
});

export const CardSchema = z.object({
  id: z.number(),
  exhibitId: z.number(),
  description: z.string(),
  media: z.string()
});

export const ImageSchema = z.object({
  url: z.string()
});
