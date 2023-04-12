# Vernon Museum and Archives Exhibit Website

## Developer Environment Setup

First, create a `.env` file at the top level. It should include a line,

```conf
DATABASE_URL="file:./dev.db"
```

You will also need to create a `.env.local` file that looks like this:

```conf
JWT_SECRET="someSecretString"
SALT_ROUNDS=2
```

Next, run

```bash
$ yarn install
```

and finally,

```bash
$ yarn run dev
```

# API Documentation

## Authentication

The API is primarily meant for the Museum's administrative website, so most of the API endpoints require authentication. Authentication is via cookies; each cookie has the key `token` and the value is an encrypted JSON Web Token that includes the user's email address as the payload. This way, the user can be both authenticated and identified with the cookie. 

The types used by the `/api/user` endpoints include the following.

|Type|Description|
|-|-|
|`UserData`|Represents all of a user's information, except for their password.|
|`ErrorMessage`|Represents an error message with the `message` field that holds a string.|

### Authenticate a User

In order to get such an authentication cookie from the API, send a request to `/api/authenticate`, and include a JSON body that includes the user's `email` and `password` (unhashed). E.g.,

```ts
const response = await fetch(
    "/api/user/authenticate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
        email: "rinkyDinkValtruvian@gmail.com", 
        password: "killBinkyBong"
    })
});
```

-   If the credentials are correct, you will get a response of `200`, a header to set the `token` cookie, and a body that includes the `UserData` (i.e., the user's information except for their password). 
-   Otherwise, it will send back a 4XX status code and an `ErrorMessage` in the body.

### Verify a User's Authenticity

If you want to verify a pre-existing cookie, you can send a request to the `/api/authentic` endpoint:

```ts
const response: Response = await fetch("/api/user/authentic");
```

-   If the user is authenticated, the response will have a status of 200 and the body will include a `UserData` object.
-   If the user is *not* authenticated, the response have a status of 4XX and the body will include an `ErrorMessage` object.

## Exhibits

Exhibits represent the actual exhibits that guest users will browse and view, and that the administrative users will create and publish. 

Types that can be transmitted to and from the `/api/exhibits` endpoint include the following.

|Type|Description|
|-|-|
|`PopulatedExhibit`|Used to represent an exhibit with it's `cards` included.|
|`PopulatedExhibitCreatable`|Used to represent an exhibit with `cards` included, but none of the cards nor exhibit should include `id` attributes. This makes them insertable to the database, however, you should still note that `title` attribute of the `Exhibit` must still be unique.|
|`ErrorMessage`|Represents an error message with the `message` field that holds a string.|

### Exhibit Creation

In order to create an Exhibit, you can send an `PopulatedExhibitCreatable` in a POST request to the `/api/exhibit` endpoint. E.g.,

```ts
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

const response = await fetch("/api/exhibit", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sampleExhibit)
})
```

Note that, although the API expects you to send a `PopulatedExhibitCreatable`, you *may* instead send a `PopulatedExhibit` (i.e., an exhibit with `id`s included). If you do so, the `id` fields will be entirely ignored, and the request will be handled like it received a `PopulatedExhibitCreatable`.

POST requests like this will send one of three responses:

|Status Code|Body|Description|
|-|-|-|
|`400`|`ErrorMessage`|Sent back when something was wrong with the reponse body (i.e., it couldn't be parsed to a `PopulatedExhibitCreatable`.)|
|`409`|`ErrorMessage & PopulatedExhibit`|Sent back when the title of the exhibit you sent is already present in the database. The insertion is aborted, and the pre-existing exhibit is included in the response.|
|`201`|`PopulatedExhibit`|Sent back when the exhibit was successfully created. The exhibit as it appears in the database is included as the body of the response.|

### Exhibit Updating

Exhibits are updated with PUT requests (not PATCH requests). PUT requests work like POST requests to this endpoint, with the only distinction being in how they handle conflicts. As previously described, if a POST request discovers that an exhibit of the same `title` already exists, it sends back `409`. However, a PUT request that finds a pre-existing exhibit of the same `title` will just delete the old version, create the new one, and then send back a `201` response with the new `PopulatedExhibit` in the body.

```ts
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

fetch("/api/exhibit", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedSampleExhibit)
});
```

|Status Code|Body|Description|
|-|-|-|
|`400`|`ErrorMessage`|Sent back when something was wrong with the reponse body (i.e., it couldn't be parsed to a `PopulatedExhibitCreatable`.)|
|`201`|`PopulatedExhibit`|Sent back when the exhibit was successfully created or replaced. The exhibit as it appears in the database is included as the body of the response.|

### Getting an Exhibit

The GET requests to `/api/exhibit` can accept a few different types of requests to get exhibits. The following are all valid GET requests.

```ts
// get a single exhibit by it's title.
fetch("/api/exhibit?title=Vernon%20Serves");

// get a series of exhibits by their titles.
fetch("/api/exhibit?title=Vernon%20Serves&title=Okeefe%20Ranch");

// get a single exhibit by it's id.
fetch("/api/exhibit?id=1");

// get a series of exhibits by their titles.
fetch("/api/exhibit?id=1&id=2");

// get all exhibits
fetch("/api/exhibits?title=*");
fetch("/api/exhibits?id=*");
```

Note that exhibt `title`'s should be encoded with `encodeURIComponent` in the request, as they are decoded using `decodeURIComponent` by the API.

If an individual exhibit is requested, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`404`|`ErrorMessage`|Sent when the requested exhibit was not found.|
|`400`|`ErrorMessage`|Sent when there's something wrong with the request. Read the error message for details.|
|`200`|`PopulatedExhibit`|Sent when the exhibit was found.|

If a specific list of exhibits are requested, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`404`|`ErrorMessage`|Sent when none of the requested exhibits are found.|
|`400`|`ErrorMessage`|Sent when there's something wrong with the request.|
|`206`|`PopulatedExhibit[]`|Sent when some, but not all, of the exhibits were found.|
|`200`|`PopulatedExhibit[]`|Sent when all of the exhibits were found.|

If the special `?id=*` or `?title=*` was sent, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`200`|`PopulatedExhibit[]`|Always sent back for this type of request.|

### Deleting an Exhibit

Deletion of an Exhibit follows the *exact* format of the GET requests. The only difference is that the fetched exhibits are also deleted (though they are still in the response).

```ts
// delete a single exhibit by it's title.
fetch("/api/exhibit?title=Vernon%20Serves", { method: "DELETE", credentials: "same-origin" });

// delete a series of exhibits by their titles.
fetch("/api/exhibit?title=Vernon%20Serves&title=Okeefe%20Ranch", { method: "DELETE", credentials: "same-origin" });

// delete a single exhibit by it's id.
fetch("/api/exhibit?id=1", { method: "DELETE", credentials: "same-origin" });

// delete a series of exhibits by their titles.
fetch("/api/exhibit?id=1&id=2", { method: "DELETE", credentials: "same-origin" });

// delete all exhibits
fetch("/api/exhibits?title=*", { method: "DELETE", credentials: "same-origin" });
fetch("/api/exhibits?id=*", { method: "DELETE", credentials: "same-origin" });
```

If an individual exhibit is deleted, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`404`|`ErrorMessage`|Sent when the requested exhibit was not found.|
|`400`|`ErrorMessage`|Sent when there's something wrong with the request. Read the error message for details.|
|`200`|`PopulatedExhibit`|Sent when the exhibit was found and deleted.|

If a specific list of exhibits are delted, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`404`|`ErrorMessage`|Sent when none of the requested exhibits are found.|
|`400`|`ErrorMessage`|Sent when there's something wrong with the request.|
|`206`|`PopulatedExhibit[]`|Sent when some, but not all, of the exhibits were found and deleted.|
|`200`|`PopulatedExhibit[]`|Sent when all of the exhibits were found and deleted.|

If the special `?id=*` or `?title=*` was sent, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`200`|`PopulatedExhibit[]`|Always sent back for this type of request.|

## Images

Images can be uploaded and deleted with the API, and then accessed via the image's assigned URL. Images are stored on the local hard drive, but they're also represented in the database to simplify operations. Deletion and posting requests are handled by first verifying the operation with the database, and then updating the local directory silently and asynchronously (i.e., after the response is sent).

The following are types for the `/api/images` endpoint.

|Type|Description|
|`Image`|Represents an image in the database. These will have, at least, a `url` attribute that represents the address you can access it from. E.g., you could set an `<img />` element's `src` attribute to an `Image`'s `url` field.|
|`ErrorMessage`|Represents an error message with the `message` field that holds a string.|

### Uploading Images

You can upload images to the server by sending them as `multipart/form-data` files. E.g.,

```tsx
async function sendImageToServer(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/image", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  return await response.json();
}
```

The above function sends and `File` to the server. Potential responses include:

|Status Code|Body|Description|
|-|-|-|
|400|`ErrorMessage`|Something was wrong with the request.|
|500|`ErrorMessage`|Something interrupted the image upload.|
|201|`Image`|The image was uploaded correctly. The `Image` object response has a `url` attribute that you can access it from.|

POST requests can take images that already have names, the image will be saved under a newly-generated name which is also represented in the `Image` response. E.g., if you upload `Img.png`, and `Img.png` already exists, the request will still be successful and will just save the new one as something like `Img_1.png`.

### Getting Images

As mentioned before, images can be accessed directly as a static file on the server, without the need for the API. E.g.,

```tsx
const response = await sendImageToServer(image);
if (!response.ok) return;
const { url } = response.json() as Image;
return <img src={url}>;
```

This snippet will successfully return an `img` element with a source that leads to the server's stored image.

### Deleting Images

Image deletion follows the same format as the `/api/exhibit` enpoint. However, the images don't have `id`s that they're accessed by. Instead, you should `encodeURIComponent` the `Image`'s `url`, and then send that as the query string's `url`.

E.g.,

```tsx
// delete a single image by it's url.
fetch(`/api/exhibit?url=${img.url}`, { method: "DELETE", credentials: "same-origin" });

// delete a series of images by their urls.
fetch(`/api/exhibit?url=${img1.url}&url=${img2.url}`, { method: "DELETE", credentials: "same-origin" });

// delete all images
fetch("/api/exhibits?url=*", { method: "DELETE", credentials: "same-origin" });
```

If an individual image is deleted, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`404`|`ErrorMessage`|Sent when the requested image was not found.|
|`400`|`ErrorMessage`|Sent when there's something wrong with the request. Read the error message for details.|
|`200`|`Image`|Sent when the image was found and deleted.|

If a specific list of images are deleted, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`404`|`ErrorMessage`|Sent when none of the requested images are found.|
|`400`|`ErrorMessage`|Sent when there's something wrong with the request.|
|`206`|`Image[]`|Sent when some, but not all, of the images were found and deleted.|
|`200`|`Image[]`|Sent when all of the images were found and deleted.|

If the special `?url=*` was sent, the response will be:

|Status Code|Body|Description|
|-|-|-|
|`200`|`Image[]`|Always sent back for this type of request.|

# Reading the Source Code

## Database

The database is running on SQLite3, and we interface with it via the <a href="https://www.prisma.io/">Prisma ORM</a>. The `/prisma` directory has all of the database files, and you can directly interact with the database via

```bash
$ sqlite3 prisma/dev.db
```

To view the structure of the database, refer to the `/prisma/schema.prisma` file.

## API Source Code Structure

All API endpoints are located in `/handlers`, and then imported to respective files in `/pages/api` so that NextJS can use it's file-based routing.

Each handler is written in a file that represents the endpoint, i.e., `/handlers/exhibit/get.ts` corresponds to `GET /api/exhibit`. A directory within `/handlers` follows the general pattern:

-   `get.ts` (or `post.ts`, `put.ts`, etc.):
    -   These files are named after HTTP methods and each one exports a single `NextApiHandler` that handles that request.
-   `index.ts`
    -   This file is where each of the `NextApiHandlers` are given middleware and aggregated into a single `NextApiHandler`. (handlers are aggregated by the `/handlers/aggregateHandlers.ts` function).

### Middleware

The `/handlers/middleware` folder is special, because it's exports include functions that take a `NextApiHandler` and wrap it in a new `NextApiHandler` that handles something with the request. 

Middleware may or may not invoke the handler you give it, depending on the request. E.g., the `withAuth` middleware follows the structure:

```ts
function withAuth(next: NextApiHandler): NextApiHandler {
    return async function(req, res) {
        // logic to determine if the request is authentic
        if (authentic) {
            next(req, res);
        } else {
            res.send(401);
        }
    }
}
```

## Types

Many types related to the database are automatically generated by Prisma. Additionally, the Zod library is used for runtime type-checking, which is used extentensively to verify API requests/responses.

All custom types are defined in `/types`. The `/types/specialModels.ts` file includes types that are based on the types generated by Prisma. E.g., `UserData` represents the `User` model in the database, but without the password.

`/types/general.ts` just include some types that aren't included in the database. E.g., `ErrorMessage`.
