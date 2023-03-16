import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
  <Html lang="en">
    <Head>
      <meta name="description" content="The Greater Vernon Museum and Archives is dedicated to creating an understanding of the North Okanagan through stories, exhibits and archives." />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="icon" href="/favicon/favicon.ico" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
  );
}
