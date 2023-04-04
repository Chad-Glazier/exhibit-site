import { ErrorMessageSchema, PopulatedExhibitSchema, UserDataSchema } from "@/types";
import { ApiTestProps } from "./ApiTest";
import { z } from "zod";

const tests: ApiTestProps[] = [
  {
    name: "Get Exhibit",
    url: "/api/exhibit?id=1",
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
];

export default tests;
