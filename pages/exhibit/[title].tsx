import { PopulatedExhibit } from "@/types";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

interface Props {
    exhibit: PopulatedExhibit | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const title: string | string[] | null = params?.title || null;

    if (!title || Array.isArray(title)) {
        return { props: { exhibit: null } };
    }

    const prisma = new PrismaClient();
    prisma.$connect();

    const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
        where: { title: title.replace(/\-/, " ") },
        include: { cards: true }
    });

    await prisma.$disconnect();

    return { props: { exhibit } };
}

export default function ExhibitPage({ exhibit }: Props) {
    return (
        <>
            <Head>
                {
                    exhibit == null ?
                      <title>"The Museum & Archives of Vernon | Virtual Exhibits"</title>
                    : <title>{exhibit.title + " | Virtual Exhibit"}</title>
                }
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <h1>Exhibit</h1>
            <p>{JSON.stringify(exhibit)}</p>
            <Link href="/">Return</Link>
        </>
    )
};