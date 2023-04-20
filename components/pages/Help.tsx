import { AdminNav } from "@/components";
import styles from "@/styles/Help.module.css";
import Image from "next/image";

export default function Help() {
  return (
    <>
      <AdminNav />
      <main className={styles.main}>
        <h1 className={styles.heading}>User Manual</h1>
        <p>This manual explains how to use the administrative side of this Exhibit Site.</p>
        <ul>
          <li><a href="#dashboard">Managing Exhibits</a></li>
          <li><a href="#gallery">Managing Images</a></li>
          <li><a href="#designer">Creating Exhibits</a></li>
        </ul>
        <section className={styles.section} id="dashboard">
          <h2 className={styles.subheading}>Exhibit Page</h2>
          <img
            src="/manual/exhibit-page.png"
            alt="Screenshot of the exhibits page"
            className={styles.screenshot}
          />
          <p>
            This page is where you can view all virtual exhibits. There are two major sections:
          </p>
          <ul>
            <li>Published - This is where all public exhibits are. Guests can view these online at the main page.</li>
            <li>Drafts - This is where drafted exhibits are kept. Guests cannot view these exhibits.</li>
          </ul>
          <p>
            Any exhibit can be "previewed"; clicking this button opens a page that is identical to how it will appear to the guest users. The only difference is that you can preview drafted exhibits as well as public ones (whereas guests only have access to public ones).
          </p>
          <p>
            When you create a new exhibit, it will be put in drafts by default. When you click on a drafted exhibit's "publish" button, it will be made public. Likewise, clicking the "unpublish" button on a public exhibit will move it into drafts and make it unavailable to guests.
          </p>
          <p>
            You also have the ability to delete exhibits by clicking the "delete" button and then confirming the deletion. Note that the images used in an exhibit are stored independently from the exhibit, so deleting an exhibit doesn't delete the images it used.
          </p>
          <p>
            The last functionality that you have on this page is the creation of a new exhibit, or the revision of an existing one. Clicking "create new" will prompt you for the new exhibit's name (note that names should be unique), create it, and then open up the exhibit designer page for it. To open the designer page for an existing exhibit, click the "edit" button.
          </p>
        </section>
        <section className={styles.section} id="gallery">
          <h2 className={styles.subheading}>Gallery Page</h2>
          <img
            src="/manual/gallery-page.png"
            alt="Screenshot of the gallery page"
            className={styles.screenshot}
          />
          <p>
            As noted before, images are stored independently of exhibits. In order to make it easier to reuse and keep track of images, the gallery page provides a simple interface to upload, download, and delete images.
          </p>
          <p>
            It is unlikely that image storage will ever cause any problems, but you should be aware that having more than about 15GB of images, which is about 7000 HD images, stored in the server will cause severe performance problems. I don't anticipate that this will impose a real limit.
          </p>
        </section>
        <section className={styles.section} id="designer">
          <h2 className={styles.subheading}>Exhibit Designer Page</h2>
          <p>
            Clicking on the "designer" button in the navigation bar at the top of the page will display a popup like the one shown below.
          </p>
          <img
            src="/manual/open-exhibit.png"
            alt="Screenshot of the 'open exhibit' prompt"
            className={styles.smallScreenshot}
          />
          <p>
            Upon entering the name of a pre-existing exhibit and clicking "open exhibit", the designer page for that exhibit will be opened. If the name you enter doesn't belong to an exhibit, a new one is created with that name before the designer opens. The image below shows the actual designer page.
          </p>
          <img
            src="/manual/designer.png"
            alt="Screenshot of the exhibit designer"
            className={styles.screenshot}
          />
          <p>
            Each exhibit is a sequence of cards, so it's fairly straightforward to create one. Each card has a piece of media, a title, and a description. To add media, click on the image on the leftmost part of the card. Doing so will give you a popup like the one shown below.
          </p>
          <img
            src="/manual/add-media.png"
            alt="Screenshot of a form to add media"
            className={styles.smallScreenshot}
          />
          <p>
            This interface lets you select an image you've previously uploaded (like the ones you see in the "Gallery") via the drop-down menu, upload a new image, or input a YouTube link.
          </p>
          <p>
            Before exiting an exhibit, it's important that you remember to save the exhibit. Otherwise, your work will be lost. The "save" button is at the top of the exhibit designer page.
          </p>
          <img
            src="/manual/save.png"
            alt="Screenshot of a form to add media"
            className={styles.screenshot}
          />
        </section>
      </main>
    </>
  )
}