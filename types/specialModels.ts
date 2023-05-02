import { Exhibit, Card, User } from "@prisma/client";
import { ExhibitSchema, CardSchema, UserSchema } from "@/prisma/zod";
import * as z from "zod";

export type UserData = Omit<User, "password">;
export const UserDataSchema = UserSchema.omit({ password: true });

export type PopulatedExhibit = Exhibit & { cards: Card[] };
export const PopulatedExhibitSchema = ExhibitSchema.extend({
    cards: z.array(CardSchema)
});

export type ExhibitCreatable = Omit<Exhibit, "id">;
export const ExhibitCreatableSchema = ExhibitSchema.omit({ id: true });

export type CardCreatable = Omit<Card, "id" | "exhibitId">;
export const CardCreatableSchema = CardSchema.omit({ 
    id: true, exhibitId: true 
});

export type PopulatedExhibitCreatable = ExhibitCreatable & { cards: CardCreatable[] };
export const PopulatedExhibitCreatableSchema = ExhibitCreatableSchema.extend({
    cards: z.array(CardCreatableSchema)
});
