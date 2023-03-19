import { useRouter } from "next/router";
import { useEffect, FunctionComponent } from "react";

export function withAuth(Page: FunctionComponent): FunctionComponent {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.get("token");
      if (!token) {
        router.push("/login");
        return;
      }
    }, []);

    return <Page {...props} />;
  }
}