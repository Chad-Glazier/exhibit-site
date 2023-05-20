import { GetServerSideProps } from "next";
import { ImagePage } from "@/components/pages";
import { authorized } from "@/util/server";
import prisma from "@/prisma";

const bucketEndpoint = process.env.R2_WORKER_URL as string;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  let imageName = context.params!.imageName;
  if (!imageName) {
    return { redirect: { destination: "/404_Admin", permanent: false } };
  }
  if (Array.isArray(imageName)) {
    imageName = imageName[0];
  }
  const imageUrl = bucketEndpoint + encodeURIComponent(imageName);
  imageName = decodeURIComponent(imageName);

  const allExhibits = await prisma.exhibit.findMany({ include: { cards: true } });
  const relevantExhibitTitles = allExhibits
      .filter(({ thumbnail, cards }) => {
        return ( 
          cards.map(({ media }) => media).includes(imageUrl)
          ||
          thumbnail === imageUrl
        );
      }).reduce((acc, { title }) => acc.includes(title) ? acc : [...acc, title], [] as string[]);

  return { props: { 
    imageUrl, 
    imageName, 
    userData,
    relevantExhibitTitles
  }};
}

export default ImagePage;