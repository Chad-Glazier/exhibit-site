# Vernon Museum and Archives Exhibit Website

This website was developed for the Greater Vernon Museum and Archives to provide a virtual exhibit website, separate from their <a href="https://vernonmuseum.ca/">main wordpress website</a>. The following documentation is for developers that may work on the project in the future; it is not a manual for end-users.

- <a href="#developer-setup">Developer Setup</a>
  - <a href="#environment-variables">Environment Variables</a>
    - <a href="#general">General</a>
    - <a href="#r2-variables">R2 Variables</a>
  - <a href="#prisma">Prisma</a>
  - <a href="#creating-the-first-admin-account">Creating the First Admin Account</a>
- <a href="#database">Database</a>
- <a href="#types">Types</a>
- <a href="#the-rest-api">The Rest API</a>
  - <a href="#how-handlers-are-written">How Handlers are Written</a>
  - <a href="#the-api-client">The API Client</a>
- <a href="#the-client">The Client</a>
  - <a href="#the-text-editor">The Text Editor</a>
  - <a href="#server-side-rendering">Server-Side Rendering</a>
- <a href="#routing">Routing</a>


# Developer Setup

Once you've cloned the project and run

```bash
npm install
```

## Environment Variables

you need to set up the environment variables. The `example.env.local` file describes the variables that need to be set, but it does not provide working examples. Below, I will describe each environment variable and how to get an appropriate value for it. If you're new to NextJS, be aware that these variables will be set in a `.env.local` file, *not* `.env`.

### General

- `DATABASE_URL`: This will be a link a a MySQL server. If you have a local installation of MySQL, passing the link to it should work. Alternatively, you can spin up a free remote server with something like <a href="https://planetscale.com/">PlanetScale</a>.
- `JWT_SECRET`: This can be any random string. Mash your keyboard or something.
- `SALT_ROUNDS`: This can be any positive integer, but don't make it big or else encryptions will take forever.
- `MASTER_KEY`: This should be something secret, but don't worry about making it too secure. Contrary to it's name, this isn't a key that grants all access to the site; it's simply used to set up the first user. After at least one admin-user is set up, this key becomes useless.

### R2 Variables

The following variables are associated with the R2 bucket I used to store images. If you're not familiar with <a href="https://www.cloudflare.com/products/r2/">Cloudflare's R2</a>, it's essentially a replacement for AWS S3. It even goes as far as to implement the S3 API, so the code for this app uses the `@aws-sdk/client-s3` package to interact with it in the `@/util/server/r2Bucket.ts` file. That is the only file that interacts with R2, so it is the only file where you will find these environment variables.

- `R2_ACCOUNT_ID`: This is a credential that is assigned to you when you create an R2 bucket on Cloudflare.
- `R2_ENDPOINT`: This can be found in the settings of your R2/S3 bucket.
- `R2_ACCESS_KEY_ID`: Once you have an R2 bucket, you can generate an API key on the dashboard. The "Access Key ID" will be included in the pair.
- `R2_ACCESS_KEY_SECRET`: This is the other half of the API key that you generate for the bucket.
- `R2_BUCKET_NAME`: This is the name of the bucket (you can just use "uploads").
- `R2_WORKER_URL`: This is the URL of a Cloudflare Worker that is configured to serve images from the bucket. At the time of writing, R2 hasn't *fully* implemented the S3 API, and notably there is no good way to serve images publicly from the bucket. If you're reading this in the future, hopefully they've implemented that part. In case they haven't, you can configure a Cloudflare worker to serve images from R2 (I'll let you read <a href="https://developers.cloudflare.com/r2/api/workers/">the docs</a> for that, it only took me about 10-15 minutes to set up).
- `R2_PROD_DOMAIN`: This is the domain name of the bucket Worker, or whatever URL lets you GET images from the bucket publicly in production. Unlike the other R2 environment variables, this one isn't used in `@/util/server/r2Bucket.ts`, but rather in `next.config.js` to configure the domain names that `Image` elements allow.
- `R2_READONLY_DOMAIN`: This is just the domain name of the Cloudflare Worker you set up (or, the public URL that you fetch images from). Like the previous environment variable, it's just used to configure `Image`s.

## Prisma

Now, once you have all of that set up, you're ready to set up Prisma, which can be done with this command:

```bash
npm run prisma-generate && npm run prisma-push
```

And finally,

```bash
npm run dev
```

## Creating the first Admin Account

In order to log in to the administrator pages, users must have an account. Accounts can only be created by the admin user. This is circular, so the creation of the first (admin) account is special. You will navigate to <a href="http://localhost:3000/register">localhost:3000/register</a>, and then enter the information for the account. The "Master Key" will be the environment variable you set in `.env.local`. Note that the account you create this way will have the unique privilege of being able to create and delete other users.

Once you have this, you're ready to use the full website; navigate to <a href="http://localhost:3000/login">localhost:3000/login</a> to login in the future.

# Database

The database for this app is fairly simple, you can find the schema in `@/prisma/schema.prisma`. For each of these tables, Prisma will generate interfaces. However, I would recommend that you avoid using those types and instead use their aliases in `@/types`. I will discuss the types in more depth in the next section.

<table>
  <thead>
    <tr colspan="2">
      <th>User</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td>The name of the user</td>
    </tr>
    <tr>
      <td><code>email</code></td>
      <td>The email of the user</td>
    </tr>
    <tr>
      <td><code>password</code></td>
      <td>The hashed password of the user</td>
    </tr>
    <tr>
      <td><code>isMaster</code></td>
      <td>Indicates if the user is the Admin user; i.e., if they were the original account created with the Master Key.</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr colspan="2">
      <th>Exhibit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td>The ID of the exhibit. This isn't used much, and in most cases the <code>title</code> field is used as a unique identifier for exhibits.</td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>The title of the exhibit</td>
    </tr>
    <tr>
      <td><code>priority</code></td>
      <td>The priority of the exhibit. <code>0</code> for "low" priority, <code>1</code> for "medium", and <code>2</code> for "high". This used to determine the order in which exhibits are displayed (exhibits with the same priority are sorted alphabetically).</td>
    </tr>
    <tr>
      <td><code>thumbnail</code></td>
      <td>The thumbnail of the exhibit, as a URL.</td>
    </tr>
    <tr>
      <td><code>summary</code></td>
      <td>The summary of the exhibit, as a string containing a JSON object that represents a Lexical Editor state.</td>
    </tr>
    <tr>
      <td><code>published</code></td>
      <td>Indicates whether the exhibit should be visible to the public.</td>
    </tr>
    <tr>
      <td><code>cards</code></td>
      <td>An array of cards that make up the exhibit.</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr colspan="2">
      <th>Card</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td>The ID of the card</td>
    </tr>
    <tr>
      <td><code>media</code></td>
      <td>The media of the card. This will either be a URL to an image stored in the R2 bucket, or a YouTube URL.</td>
    </tr>
    <tr>
      <td><code>description</code></td>
      <td>The description of the card, as a string containing a JSON object that represents a Lexical Editor state.</td>
    </tr>
    <tr>
      <td><code>exhibitId</code></td>
      <td>The ID of the associated exhibit</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr colspan="2">
      <th>Image</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td>The URL of the image</td>
    </tr>
  </tbody>
</table>

# Types

Pretty much every type that's used throughout the app is defined in the `@/types` directory. In general, all Zod objects are defined in the same file that their corresponding types are, and share names with their types and a -`Schema` suffix. They are grouped into a number of files:

|File|Included Types|
|-|-|
|`databaseModels.ts`|This file imports the types defined by Prisma that represent the database's tables. In this file, those types are aliased to have the -`Type` suffix, for the sake of disambiguation (e.g., the image `Image` type shares a name with the `next/image` component) and because some types (`Card` and `Exhibit`) possess the `Prisma.JsonValue` type. This type is great for the underlying database to represent the serialized state of a Lexical text editor, but is extremely difficult to use with types; so in this file, any `Prisma.JsonValue` fields are changed to `string` types.|
|`specialModels.ts`|This file contains a number of special variants of the types defined in `databaseModels.ts`. Each of these types extend the original database types in some way. E.g., `PopulatedExhibit` is just an `Exhibit` with the array of `Card`s associated with it.|
|`general.ts`|This file contains some miscellaneous types. E.g., `Credentials`, `ErrorMessage`, etc.|
|`responseWrapper.ts`|This file contains the type `ApiResponse`, which is used exclusively within the `@/util/client/ApiClient` directory.|
|`specialApiHandlers.ts`|This file contains special function types that resemble `NextApiHandler`, for the sake of being used as arguments to certain middleware. This is easier to understand if you look at the code for the middleware and handler functions.|

All of these types can be imported directly from `"@/types"`. If you define any more custom types, I would encourage you to export them from here.

You may also note that none of these types are classes, nor do any of them have methods. This is a personal design choice to make them directly serializable.

# The Rest API

This app implements a restful API to handle interactions between the client and server. Each API handler is written in `@/handlers/`. For each request endpoint, you will find a corresponding filepath. E.g., the file at `@/handlers/exhibit/get.ts` handles GET requests to `/api/exhibit`. 

## How Handlers are Written

The `index.ts` of each directory in `@/handlers` is where the handlers are aggregated and where middleware is applied. In NextJS, at the time of writing, the native way to apply middleware is to just write wrapper functions. This process isn't as convenient as the ExpressJS style, but it makes it pretty easy to see what middleware is applied to a handler (and in what order).

The `middleware` directory is special because it doesn't correspond to any endpoints, instead it just holds the middleware wrapper functions.

Since the code paths are pretty straightforward, I won't bother explaining every endpoint; you can pretty easily look for yourself to see what endpoints are available and how they're handled. Additionally, interactions with the API should generally be set on the `api` object I defined for the client.

Another thing that I would encourage you to do is create error messages that are readable to the end user. This way, you can directly display that message to the user instead of having to map each error code to a custom message on the client-side.

## The API Client

The client has access to an object defined in `@/util/client` that lets you make predefined requests to the API, in a safe way that wraps the response in a special object. The code is all in `@/util/client/ApiClient`, and I won't explain it here because it's all very thoroughly commented. If you want to interact with the API, just import the object:

```ts
import { api } from "@/util/client";
```

And from there, let the LSP hold your hand. If you make changes to the Rest API or add endpoints to it, I would strongly encourage you to reflect those changes in this `api` object.

# The Client

The client code is all written in `@/components`:

- `general` contains components that are used by more than one page.
- `layouts` contains layout components.
- `pages` contains a subdirectory for each page. In each subdirectory is a number of components that are specific to that page.

In general, I tried to avoid installing any extra packages, so the code you see in this folder is pretty much all of the code that is used.

The CSS is written with the CSS Module system that is provided by NextJS out of the box. In this system, each component should correspond to exactly one `Component.module.css` file, and vice versa. That module is scoped to that component and nothing else. This leads to a fair bit of repeated CSS, but I honestly don't mind because the decoupling makes it really easy to change the CSS applied to a component; you can always assume that the *only* style that is applied to a component is defined in the corresponding `module.css` file.

The exception to this rule is the `globals.css` module, which applies to everything. I defined a couple of variables in there, so look there if you encounter a variable that you can't track down.

## The Text Editor

This app uses the <a href="https://github.com/facebook/lexical">Lexical framework</a> to implement its rich text editors. At the time of writing, this framework is still in version `0.X`, so if you're reading this in the future, it's very possible that the interface has changed. If you can avoid dealing with the editor, try to do so. However, if you must make significant changes to it, it may just be easier to recreate it with a modern version of the framework.

Note that the state of a Lexical editor is serialized to JSON, which is why the `Exhibit.summary` and `Card.description` columns in the database are represented with the MySQL `JSON` type instead of `VarChar`s. Additionally, if you want to create a new and empty text editor, you can can use the `TextEditor.emptyEditorState()` method to return a JSON object that represents the empty state.

## Server-Side Rendering

You may notice that some of the `@/components/pages/` components expect props. This is because those props are fetched by the server during the SSR process that NextJS uses. You can find the `getServerSideProps` functions for each page component in a corresponding `@/pages/` file. This folder is treated specially by NextJS and will be explained in the next section.

# Routing

In NextJS, routes are automatically generated according to the `@/pages` directory (if you're reading this in the future, modern versions will instead use the `@/app` directory). Each file in this directory should export a React component that represents a page. Thus, each page defined in `@/components/pages/` has a corresponding file in `@/pages` so that it's given a route. Likewise, each aggregate handler in `@/handlers` has a corresponding filepath in `@/pages/api`, which is special because it expects each file to export a `NextApiHandler` instead of a React component.

Each file in `@/pages` which exports a React component (a page) may optionally export a `getServerSideProps` function which is executed on the server before the page is SSR'd and sent to the client. To see how this works, I would encourage you to just look at the examples in those files.
