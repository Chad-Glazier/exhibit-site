# Vernon Museum and Archives Exhibit Website

This website was developed for the Greater Vernon Museum and Archives to provide a virtual exhibit website, separate from their <a href="https://vernonmuseum.ca/">main wordpress website</a>. The following documentation is for developers that may work on the project in the future; it is not a manual for end-users.

- <a href="#developer-setup">Developer Setup</a>


# Developer Setup

Once you've cloned the project and run

```bash
npm install
```

you need to set up the environment variables. The `example.env.local` file describes the variables that need to be set, but it does not provide working examples. Below, I will describe each environment variable and how to get an appropriate value for it:

### General Variables

- `DATABASE_URL`: This will be a link a a MySQL server. If you have a local installation of MySQL, passing the link to it should work. Alternatively, you can spin up a free remote server with something like <a href="https://planetscale.com/">PlanetScale</a>.
- `JWT_SECRET`: This can be any random string. Mash your keyboard or something.
- `SALT_ROUNDS`: This can be any positive integer, but don't make it big or else encryptions will take forever.
- `MASTER_KEY`: This should be something secret, but don't worry about making it too secure. Contrary to it's name, this isn't a key that grants all access to the site; it's simply used to set up the first user. After at least one admin-user is set up, this key becomes useless.

### R2 Variables

The following variables are associated with the R2 bucket I used to store images. If you're not familiar with <a href="https://www.cloudflare.com/products/r2/">Cloudflare's R2</a>, it's essentially a replacement for AWS S3. It even goes as far as to implement the S3 API, so the code for this app uses the `@aws-sdk/client-s3` to interact with it in the `@/util/server/r2Bucket.ts` file. That is the only file that interacts with R2, so it is the only file where you will find these environment variables.

- `R2_ACCOUNT_ID`: This is a credential that is assigned to you when you create an R2 bucket on Cloudflare.
- `R2_ENDPOINT`: This can be found in the settings of your R2/S3 bucket.
- `R2_ACCESS_KEY_ID`: Once you have an R2 bucket, you can generate an API key on the dashboard. The "Access Key ID" will be included in the pair.
- `R2_ACCESS_KEY_SECRET`: This is the other half of the API key that you generate for the bucket.
- `R2_BUCKET_NAME`: This is the name of the bucket (you can just use "uploads").
- `R2_WORKER_URL`: This is the URL of a Cloudflare Worker that is configured to serve images from the bucket. At the time of writing, R2 hasn't *fully* implemented the S3 API, and notably there is no good way to serve images publicly from the bucket. If you're reading this in the future, hopefully they've implemented that part. In case they haven't, you can configure a Cloudflare worker to serve images from R2 (I'll let you read <a href="https://developers.cloudflare.com/r2/api/workers/">the docs</a> for that, it only took me about 10-15 minutes to set up).
- `R2_PROD_DOMAIN`: This is the domain name of the bucket Worker, or whatever URL lets you GET images from the bucket publicly in production. Unlike the other R2 environment variables, this one isn't used in `@/util/server/r2Bucket.ts`, but rather in `next.config.js` to configure the domain names that `Image` elements allow.
- `R2_READONLY_DOMAIN`: This is like the previous environment variable, except that it's the `.dev` endpoint that Cloudflare provides for buckets. You can omit this variable, but if you want to use it, you should be able to find the URL somewhere in the settings for your R2 bucket. Note that, although this endpoint can be used in place of a custom Worker or public domain name to GET images from the bucket, it's not meant for production and has restrictions.

Now, once you have all of that set up, you're ready to set up Prisma.

```bash
npm run prisma-generate && npm run prisma-push
```

And finally,

```bash
npm run dev
```

