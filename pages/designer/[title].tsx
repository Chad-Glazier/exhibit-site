import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/components/hoc';
import { GetServerSideProps } from 'next';
import { PopulatedExhibit, UserData } from '@/types';
import prisma from '@/prisma';
import { NotFound } from '@/components/pages';
import styles from "@/styles/Dashboard.module.css";
import { AdminNav } from '@/components';

interface Card {
  id: number;
  media: string;
  description: string;
}

interface DesignerProps {
  exhibit: PopulatedExhibit | null;
  userData: UserData | null;
}

async function updateExhibit(updatedExhibit: PopulatedExhibit){
  await fetch("/api/exhibit", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedExhibit)
  });
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const title: string | string[] | null = params?.title || null;

  if (!title || Array.isArray(title)) {
    return { props: { exhibit: null } };
  }

  const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
    where: {
      title: decodeURIComponent(title)
    },
    include: { cards: true }
  });

  return { props: { exhibit, userData: null }};
}

function IImage({url, thumbnail}){
  return (<div
      style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        width: '60vh',
        height: '40vh'
      }}
    >
    <img
    src={`/exhibit-media/${thumbnail?'thumbnails':'cards'}/${url}`}
    alt=""
    style={{
      height: 'auto',
      width: '60vh',
    }} />
  </div>
  )
}

function Designer({
  exhibit,
  userData
}: DesignerProps) {
  const router = useRouter();
  const { title } = router.query;

  if (exhibit === null) {
    return <NotFound />;
  }

  const [main, setMain] =useState({...exhibit, cards: null});
  const [cards, setCards] = useState<Card[]>(exhibit.cards);

  const addCard=()=>{
    setCards(prevState => [...prevState,{id:Date.now(),media:'',description:''}])
  }
  const onSave =()=>{
    console.log(cards)
    const ex = {...exhibit, ...main,cards: cards}
    updateExhibit(ex)
  }

  const handleMainChange = (thumbnail: string, summary: string) =>{
    setMain(prev=>({...prev,thumbnail, summary}))
  }

  const handleCardChange = (id: number, media: string, description: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, media, description } : card,
      ),
    );
  };

  const isYoutubeVideo = (url: string): boolean => {
    return url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/) !== null;
  };

  const MediaPreview = ({ url, thumbnail }: { url: string }) => {
    if (isYoutubeVideo(url)) {
      const videoId = url.split('v=')[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      return (
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else {
      return <IImage url={url} thumbnail={thumbnail}/>;
    }
  };

  return (
    <div>
      <AdminNav />
      <h1>Edit Exhibit: {title}</h1>
      <div
        style={{
          display: "flex",
          padding: 10
        }}
        key={exhibit.id}>
        <MediaPreview key={main.thumbnail} url={main.thumbnail} thumbnail />
        <div
          style={{
            display: "flex",
            flexGrow: 1
          }}
        >
        <input
          type="text"
          value={main.thumbnail}
          onChange={(e) => handleMainChange(e.target.value, exhibit.summary)}
        />
        <textarea
          style={{
            flexGrow: 1
          }}
          value={main.summary}
          onChange={(e) => handleMainChange(exhibit.thumbnail, e.target.value)}
        />
        </div>
      </div>
      {cards.map((card) => (
        <div
          style={{
            display: "flex",
            padding: 10
          }}
          key={card.id}>
          <MediaPreview key={card.media} url={card.media} />
          <div
            style={{
              display: "flex",
              flexGrow: 1
            }}
          >
          <input
            type="text"
            value={card.media}
            onChange={(e) => handleCardChange(card.id, e.target.value, card.description)}
          />
          <textarea
            style={{flexGrow: 1}}
            value={card.description}
            onChange={(e) => handleCardChange(card.id, card.media, e.target.value)}
          />
          </div>
        </div>
      ))}
      <div
        className={styles.createButton + " " + styles.exhibitTile}
        onClick={addCard}
      >
        <h3>Create New</h3>
      </div>
      <button onClick={onSave}>Save</button>
    </div>
  );
}

export default withAuth(Designer);
