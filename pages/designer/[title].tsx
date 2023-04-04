import { PopulatedExhibit } from "@/types";
import prisma from "@/prisma";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useMemo } from "react";

interface Props {
  exhibit: PopulatedExhibit | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const title: string | string[] | null = params?.title || null;

  if (!title || Array.isArray(title)) {
    return { props: { exhibit: null } };
  }

  const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
    where: { title: title.replace(/\-/, " ") },
    include: { cards: true }
  });

  return { props: { exhibit } };
}

export default function ExhibitPage({ exhibit }: Props) {
  const router: NextRouter = useRouter();
  useMemo(() => router, [router]);

  return (
    <>
      <Head>
        {
          exhibit == null ?
            <title>"The Museum & Archives of Vernon | Virtual Exhibits"</title>
          : <title>{"Designer | " + exhibit.title}</title>
        }
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>Exhibit Designer</h1>
      <p>{JSON.stringify(exhibit)}</p>
      <Link href="_" onClick={(e) => { e.preventDefault(); router.back(); }}>Return</Link>
    </>
  )
};