import { Help } from "@/components/pages";
import { GetServerSideProps } from "next";
import { authorized } from "@/util/server";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return {
    props: {
      userData
    }
  }
}

export default Help;