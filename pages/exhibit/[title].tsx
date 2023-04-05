import { PopulatedExhibit } from "@/types";
import prisma from "@/prisma";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import styles from "@/styles/Exhibit.module.css"
import { NotFound } from "@/components/pages";
import Card from "@/components/Card";
import React, { useState } from 'react';

export interface ExhibitPageProps {
  exhibit: PopulatedExhibit | null;
}

export const getServerSideProps: GetServerSideProps<ExhibitPageProps> = async ({ params }) => {
  const title: string | string[] | null = params?.title || null;

  if (!title || Array.isArray(title)) {
    return { props: { exhibit: null } };
  }

  const exhibit: PopulatedExhibit | null = await prisma.exhibit.findFirst({
    where: {
      AND: [
        { title: decodeURIComponent(title) },
        { published: true }
      ]
    },
    include: { cards: true }
  });

  return { props: { exhibit } };
}

export default function ExhibitPage({
  exhibit
}: ExhibitPageProps) {
  if(!exhibit){
    return <NotFound />
  }
  const { title, thumbnail, summary, cards }: PopulatedExhibit = exhibit;
  console.log(exhibit)
  const mainCard = {
      src:`/exhibit-media/thumbnails/${thumbnail}`,
      description: summary
    };
  const [selectedCard, setSelectedCard] = useState(mainCard);
  const isYoutube = selectedCard?.src?.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/);
  const videoId = selectedCard?.src?.split('v=')[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const contentCards = [
    mainCard,
    ...cards.map((item) => {
      return {
        ...item,
        src: item?.media?.includes('http') ?
          item.media
          : `/exhibit-media/cards/${item.media}`.replace('png','jpg')
      }
    })
  ];

  return (
    <div
      className={styles.main}
    >
      <Header/>
      <Head>
        {
          exhibit == null ?
            <title>The Museum & Archives of Vernon | Virtual Exhibits</title>
          : <title>{exhibit.title + " | Virtual Exhibit"}</title>
        }
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.detailContainer}>
        {isYoutube ?
          <iframe src={embedUrl} />
          : <img src={selectedCard.src} alt="exhibit media"/>
        }
        <div className={styles.textsContainer}>
          <h2>{title}</h2>
          <p>{selectedCard.description}</p>
        </div>
      </div>
      <div
      className={styles.contentContainer}>
        {contentCards.map((item, index) => (
          <div
            className={styles.cardContainer}
            onClick={()=>setSelectedCard(item)}
            key={index}
          >
            <div className={styles.cardInner}>
            <Card {...item} src={item.src || `/exhibit-media/cards/media.jpg`}/>
          </div>
          </div>
        ))}
      </div>
    </div>
  )
};
