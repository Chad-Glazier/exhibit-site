import { UserData, UserDataSchema } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState, FunctionComponent, ComponentProps } from "react";
import DefaultLoading from "./Loading";

export interface WithAuthProps {
  userData: UserData | null;
}

export default function withAuth<T extends WithAuthProps>(
  WrappedComponent: FunctionComponent<T>,
  LoadingPage: FunctionComponent<{}> = DefaultLoading
) {
  return function Wrapper(props: T) {

    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();

    useEffect(() => {
      router.prefetch("/login");
      verifyToken()
        .then((userData: UserData | null) => {
          if(userData === null) {
            router.push("/404");
          };
          setUserData(userData);
        });
    }, []);

    if (userData === null) {
      return <LoadingPage />;
    }

    const newProps: T = {
      ...props,
      userData
    }

    return <WrappedComponent {...newProps} />;
  };
};

async function verifyToken(): Promise<UserData | null> {
  const response: Response = await fetch("/api/user/authentic");
  if (!response.ok) {
    return null;
  }
  const body: any = await response.json();
  try {
    const userData: UserData = UserDataSchema.parse(body);
    return userData;
  } catch {
    console.log("Unexpected parsing error. Server sent an unparsable object:");
    console.log(body);
    console.log("Expected a `UserData` object instead");
    return null;
  }
}