import React, { useEffect, useState } from "react";
import styles from "@/styles/Gallery.module.css";
import { ConfirmPopup, UploadImagePopup, AdminNav } from "@/components";
import { Image } from "@prisma/client";
import path from "path";
import { GetServerSideProps } from "next";
import prisma from "@/prisma";
import Head from "next/head";

interface GalleryProps {
  initialImages: Image[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const images: Image[] = await prisma.image.findMany();

  return {
    props: {
      initialImages: images
    }
  };
}

export default function Gallery({ initialImages }: GalleryProps) {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);

  async function fetchImages() {
    const response = await fetch("/api/image?url=*");
    const data: Image[] = await response.json();
    setImages(data);
  }

  async function addImage(image: File) {
    await sendImageToServer(image);
    fetchImages();
  }

  async function deleteImage({ url }: Image) {
    url = encodeURIComponent(url);
    setImages((prev) => prev.filter(img => img.url !== url));
    await fetch("/api/image?url=" + url, {
      method: "DELETE",
      credentials: "same-origin"
    });
    fetchImages();
  }

  function ImageTile({ image }: { image: Image }) {
    const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);

    return (
      <>
        <AdminNav />
        {showConfirmPopup && (
          <ConfirmPopup
            message={`Are you sure you want to permanently delete "${path.basename(image.url)}"?`}
            onCancel={() => setShowConfirmPopup(false)}
            onConfirm={() => {
              setShowConfirmPopup(false);
              deleteImage(image);
            }}
          />
        )}
        <div className={styles.imageTile}>
          <img className={styles.thumbnail} src={image.url} alt={image.url} />
          {path.basename(image.url)}
          <div className={styles.actions}>
            <button onClick={() => setShowConfirmPopup(true)}>Delete</button>
            <a href={image.url} target="_blank" rel="noopener noreferrer">
              <button>Download</button>
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Gallery | The Museum & Archives of Vernon</title>
      </Head>
      <div className={styles.imageGallery}>
        <h1>Image Gallery</h1>
        <div className={styles.images}>
          {images.map((image) => (
            <ImageTile key={image.url} image={image} />
          ))}
          <div className={styles.addButton} onClick={() => setShowUploadPopup(true)}>
            <h3>Add New Image</h3>
          </div>
        </div>
        {showUploadPopup && (
          <UploadImagePopup
            onUpload={(image: File) => {
              addImage(image);
              setShowUploadPopup(false);
            }}
            onCancel={() => setShowUploadPopup(false)}
          />
        )}
      </div>    
    </>
  );
}

async function sendImageToServer(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/image", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  return await response.json();
}
