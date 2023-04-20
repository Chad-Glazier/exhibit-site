import { CreateExhibitPopup, AdminNav } from "@/components";
import { PopulatedExhibitSchema } from "@/types";
import { useRouter } from "next/router";

export default function DesignerIndex() {
  const router = useRouter();

  return (
    <>
      <AdminNav />
      <CreateExhibitPopup
        confirmText="Open Exhibit"
        onCancel={() => router.push("/dashboard")}
        onCreate={async (title) => {
          const response = await fetch("/api/exhibit", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              summary: "",
              thumbnail: "",
              cards: [],
              published: false
            })
          });
          if (response.ok || response.status === 409) {
            const exhibit = PopulatedExhibitSchema.parse(await response.json());
            router.push("/designer/" + encodeURIComponent(exhibit.title));          
          }
        }}
      />
    </>
  )
}