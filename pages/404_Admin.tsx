import { AdminNotFound } from "@/components/pages";
import { authorized } from "@/util/server";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
 
  if (!userData) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      userData: null
    }
  };
}

export default AdminNotFound;