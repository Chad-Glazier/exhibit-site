import { ExhibitType, CardType, UserType } from "./databaseModels";
import { CardSchema, ExhibitSchema, UserSchema } from "./databaseModels";
import * as z from "zod";

export type UserData = Omit<UserType, "password">;
export const UserDataSchema = UserSchema.omit({ password: true });

export type PopulatedExhibit = ExhibitType & { cards: CardType[] };
export const PopulatedExhibitSchema = ExhibitSchema.extend({
    cards: z.array(CardSchema)
});

export type ExhibitCreatable = Omit<ExhibitType, "id">;
export const ExhibitCreatableSchema = ExhibitSchema.omit({ id: true });

export type CardCreatable = Omit<CardType, "id" | "exhibitId">;
export const CardCreatableSchema = CardSchema.omit({ 
    id: true, exhibitId: true 
});

export type PopulatedExhibitCreatable = ExhibitCreatable & { cards: CardCreatable[] };
export const PopulatedExhibitCreatableSchema = ExhibitCreatableSchema.extend({
    cards: z.array(CardCreatableSchema)
});
