import * as z from "zod";

export const CardSchema = z.object({
  id: z.number().int(),
  media: z.string(),
  description: z.string(),
  exhibitId: z.number().int(),
});

export const ExhibitSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  thumbnail: z.string(),
  summary: z.string(),
  published: z.boolean(),
});

export const ImageSchema = z.object({
  url: z.string(),
});

export const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isMaster: z.boolean(),
})
