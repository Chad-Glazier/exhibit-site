import { Gallery } from "@/components/pages";
import prisma from "@/prisma";
import { authorized } from "@/util/server";
import { GetServerSideProps } from "next";
import { Image } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const images: Image[] = await prisma.image.findMany();

  return { props: { images, userData } };
} 

export default Gallery;