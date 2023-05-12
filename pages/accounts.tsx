import { Accounts } from "@/components/pages";
import { GetServerSideProps } from "next";
import prisma from "@/prisma";
import { authorized } from "@/util/server";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const users = await prisma.user.findMany();

  return {
    props: {
      users,
      userData
    }
  }
}

export default Accounts;