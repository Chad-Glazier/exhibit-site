import { AdminServerError } from "@/components/pages";
import { GetServerSideProps } from "next";
import { authorized } from "@/util/server";

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

export default AdminServerError;