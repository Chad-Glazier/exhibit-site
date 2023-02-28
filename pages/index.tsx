import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { GetServerSideProps } from "next";
import { PopulatedExhibit } from "@/types";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";


interface Props {
    exhibits: PopulatedExhibit[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const prisma = new PrismaClient();
    prisma.$connect();

    const exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
        include: { cards: true }
    });

    await prisma.$disconnect();

    return { props: { exhibits } };
}

export default function Home({ exhibits }: Props) {
    return (
    <>
        <Head>
            <title>The Museum & Archives of Vernon | Virtual Exhibits</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className={styles.main}>
            <h1>Exhibits</h1>
            <ul>
            {...exhibits.map((exhibit, index) => (
                <li key={index}>
                    <Link href={`/exhibit/${exhibit.title}`}>
                        {`${exhibit.title.replace(/\-/, " ")}`}
                    </Link>
                </li>
                ))
            }                
            </ul>
        </main>
    </>
    );
}
