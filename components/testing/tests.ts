import { ErrorMessageSchema, ExhibitCreatable, PopulatedExhibitSchema, UserDataSchema } from "@/types";
import { ApiTestProps } from "./ApiTest";
import { z } from "zod";

const sampleExhibit: ExhibitCreatable = {
  title: "Sample's Title;",
  thumbnail: "thumbnail-1.png",
  summary: "Sample summary",
  published: false
}

const tests: ApiTestProps[] = [
  {
    name: "Get Exhibit",
    url: `/api/exhibit?title=`,
    request: {
      method: "GET"
    },
    expectedReponseBodies: [
      PopulatedExhibitSchema
    ]
  },
  {
    name: "Get Exhibits by ID List",
    url: "/api/exhibit?id=1&id=2",
    request: {
      method: "GET"
    },
    expectedReponseBodies: [
      z.array(PopulatedExhibitSchema)
    ]
  },
  {
    name: "Get All Exhibits",
    url: "/api/exhibit?id=*",
    request: {
      method: "GET"
    },
    expectedReponseBodies: [
      z.array(PopulatedExhibitSchema)
    ]
  },
  {
    name: "Invalid User Authentication",
    url: "/api/user/authenticate",
    request: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "incorrectEmail@gmail.com",
        password: "wrongPassword",
      }),
    },
    expectedReponseBodies: [ErrorMessageSchema],
  },
  {
    name: "Verify Authenticated User",
    url: "/api/user/authentic",
    request: {
      method: "GET",
      credentials: "include",
    },
    expectedReponseBodies: [UserDataSchema],
  },
  {
    name: "Verify Unauthenticated User",
    url: "/api/user/authentic",
    request: {
      method: "GET",
      credentials: "omit",
    },
    expectedReponseBodies: [ErrorMessageSchema],
  },
  {
    name: "Post an Exhibit",
    url: "/api/exhibit",
    request: {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        "title": "Vernons Chinatown 3",
        "thumbnail": "thumbnail3.jpg",
        "summary": "Lorem ipsum dolor",
        "published": true,
        "cards": [
          {
            "media": "media.png",
            "description": "a new picture ",
          }
        ]
      })
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  },
  {
    name: "Put an Exhibit",
    url: "/api/exhibit",
    request: {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        "title": "Vernon Chinatown 3",
        "thumbnail": "thumbnail3.jpg",
        "summary": "Updated summary",
        "published": true,
        "cards": [
          {
            "media": "media.png",
            "description": "an updated picture",
          }
        ]
      })
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  },
  {
    name: "Delete an Exhibit",
    url: "/api/exhibit?",
    request: {
      method: "DELETE",
      credentials: "same-origin"
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  },
];

export default tests;
