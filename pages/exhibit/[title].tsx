import { PopulatedExhibit } from "@/types";
import prisma from "@/prisma";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import styles from "@/styles/Exhibit.module.css"
import { NotFound } from "@/components/pages";
import Card from "@/components/Card";
import React, { useState } from 'react';

interface Props {
  exhibit: PopulatedExhibit | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
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

export default function ExhibitPage({ exhibit }: Props) {
  if(!exhibit){
    return <NotFound />
  }
  const { title, thumbnail, summary, cards }: PopulatedExhibit = exhibit
  const mainCard = {
      src:`/exhibit-media/thumbnails/${thumbnail}`,
      description: summary
    }
  const [selectedCard, setSelectedCard] = useState(mainCard);
  const isYoutube = selectedCard?.src?.includes('youtube.com')

  const contentCards = [
    mainCard,
    ...[
      ...cards,
      {
        media:'https://www.youtube.com/embed/cV0_DFkJU_w',
        description: 'youtube video from the museum archives'
      }
    ].map((item)=>{
      console.log({...item,src:`/exhibit-media/cards/${item.media}`})
      return {
        ...item,
        src:item?.media?.includes('http')?item.media:`/exhibit-media/cards/${item.media}`.replace('png','jpg')
      }})
  ]
  return (
    <div
      className={styles.main}
    >
      <Header/>
      <Head>
        {
          exhibit == null ?
            <title>"The Museum & Archives of Vernon | Virtual Exhibits"</title>
          : <title>{exhibit.title + " | Virtual Exhibit"}</title>
        }
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.detailContainer}>
        {isYoutube?<iframe src='https://www.youtube.com/embed/cV0_DFkJU_w' />:<img src={selectedCard.src}/>}
        <div className={styles.textsContainer}>
          <h2>{title}</h2>

          <p>{selectedCard.description}</p>
        </div>
      </div>
      <div
      className={styles.contentContainer}>
        {contentCards.map((item)=>(
          <div
            className={styles.cardContainer}
            onClick={()=>setSelectedCard(item)}
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
