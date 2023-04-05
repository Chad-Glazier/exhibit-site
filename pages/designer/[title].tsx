// pages/designer/[title].tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/components/hoc';
import { GetServerSideProps } from 'next';
import { PopulatedExhibit, UserData } from '@/types';
import prisma from '@/prisma';
import { NotFound } from '@/components/pages';

interface Card {
  id: number;
  media: string;
  description: string;
}

interface DesignerProps {
  exhibit: PopulatedExhibit | null;
  userData: UserData | null;
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

function Designer({
  exhibit,
  userData
}: DesignerProps) {
  const router = useRouter();
  const { title } = router.query;

  if (exhibit === null) {
    return <NotFound />;
  }

  const [cards, setCards] = useState<Card[]>(exhibit.cards);

  // Fetch exhibit data here and populate the cards state
  useEffect(() => {
    if (title) {
      // Fetch exhibit data from the server
      // ...
    }
  }, [title]);

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

  const MediaPreview = ({ url }: { url: string }) => {
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
      return <img src={url} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />;
    }
  };

  return (
    <div>
      <h1>Edit Exhibit: {title}</h1>
      {cards.map((card) => (
        <div key={card.id}>
          <MediaPreview url={card.media} />
          <input
            type="text"
            value={card.media}
            onChange={(e) => handleCardChange(card.id, e.target.value, card.description)}
          />
          <textarea
            value={card.description}
            onChange={(e) => handleCardChange(card.id, card.media, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default withAuth(Designer);
