import { ErrorMessageSchema, PopulatedExhibitCreatable, PopulatedExhibitSchema, UserDataSchema } from "@/types";
import { ApiTestProps } from "./ApiTest";
import { z } from "zod";

const sampleExhibit: PopulatedExhibitCreatable = {
  title: "Sample's Title;",
  thumbnail: "thumbnail-1.png",
  summary: "Sample summary",
  cards: [
    {
      media: "some-media.png",
      description: "sample description and stuff."
    },
    {
      media: "some-other-media.png",
      description: "sample description number two."
    }
  ],
  published: false
};

const sampleExhibitUpdated: PopulatedExhibitCreatable = {
  title: "Sample's Title;",
  thumbnail: "thumbnail-1.png",
  summary: "Updated sample summary",
  cards: [
    {
      media: "some-media.png",
      description: "sample description and stuff."
    },
    {
      media: "updated-some-other-media.png",
      description: "updated sample description number two."
    }
  ],
  published: false
};

const otherSampleExhibit: PopulatedExhibitCreatable = {
  title: "Other's Title;",
  thumbnail: "thumbnail-2.png",
  summary: "Other sample summary",
  cards: [
    {
      media: "some-other-media.png",
      description: "Other sample description and stuff."
    },
    {
      media: "some-other-other-media.png",
      description: "Other sample description number two."
    }
  ],
  published: false
};

const createTests: ApiTestProps[] = [
  {
    name: "Create a New Exhibit",
    url: "/api/exhibit",
    request: {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sampleExhibit)
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  },
  {
    name: "Create or Replace an Exhibit",
    url: "/api/exhibit",
    request: {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otherSampleExhibit)
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  }
];

const readTests: ApiTestProps[] = [
  {
    name: "Get an Exhibit",
    url: `/api/exhibit?title=${encodeURIComponent(sampleExhibit.title)}`,
    request: {
      method: "GET"
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  },
  {
    name: "Get a List of Exhibits",
    url: `/api/exhibit?title=${encodeURIComponent(sampleExhibit.title)}&title=${encodeURIComponent(otherSampleExhibit.title)}`,
    request: {
      method: "GET"
    },
    expectedReponseBodies: [z.array(PopulatedExhibitSchema)]
  },
  {
    name: "Get All Exhibits",
    url: "/api/exhibit?title=*",
    request: {
      method: "GET"
    },
    expectedReponseBodies: [z.array(PopulatedExhibitSchema)]
  }
];

const updateTests: ApiTestProps[] = [
  {
    name: "Replace an Existing Exhibit",
    url: "/api/exhibit",
    request: {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sampleExhibitUpdated)
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  }
];

const deleteTests: ApiTestProps[] = [
  {
    name: "Delete an Exhibit",
    url: `/api/exhibit?title=${encodeURIComponent(sampleExhibitUpdated.title)}`,
    request: {
      method: "DELETE",
      credentials: "same-origin"
    },
    expectedReponseBodies: [PopulatedExhibitSchema]
  },
  {
    name: "Delete a List of Exhibits",
    url: `/api/exhibit?title=${encodeURIComponent(sampleExhibitUpdated.title)}&title=${encodeURIComponent(otherSampleExhibit.title)}`,
    request: {
      method: "DELETE",
      credentials: "same-origin"
    },
    expectedReponseBodies: [z.array(PopulatedExhibitSchema)]
  }
]

const tests: ApiTestProps[] = [
  ...createTests,
  ...readTests,
  ...updateTests,
  ...deleteTests
];

export default tests;
