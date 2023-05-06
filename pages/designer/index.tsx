import { OpenExhibit } from "@/components/pages";
import { GetServerSideProps } from "next";
import { authorized } from "@/util/server";
import prisma from "@/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const exhibitCache = await prisma.exhibit.findMany();

  return {
    props: {
      userData,
      exhibitCache
    }
  };
}

export default OpenExhibit;