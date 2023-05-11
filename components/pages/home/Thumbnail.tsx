import { PopulatedExhibit } from "@/types";
import styles from "./Thumbnail.module.css";
import { TextEditor } from "@/components/general";
import Image from "next/image";
import Link from "next/link";

export default function Thumbnail({
  exhibit
}: {
  exhibit: PopulatedExhibit;
}) {
  return (
    <div>
      <Link href={`/${encodeURIComponent(exhibit.title)}`}>
        <h1>{exhibit.title}</h1>
        <Image 
          src={exhibit.thumbnail} 
          alt="Thumbnail Image" 
          width={200}
          height={200}
        />
        <TextEditor
          initialState={exhibit.summary}
          readonly={true}
        />
      </Link>
    </div>
  );
}