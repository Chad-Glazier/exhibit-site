import styles from "./Help.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function Help({
  userData
}: {
  userData: UserData;
}) {
  return (
    <>
      <AdminLayout
        pageName="Help"
        userData={userData}
        className={styles.page}
      >
        <section id="table-of-contents">
          <h1>User Manual</h1>
          <ul>
            <li>
              <Link href="#dashboard">
                The Exhibits Page
              </Link>
            </li>
            <li>
              <Link href="#designer">
                The Designer Page
              </Link>
              <ul>
                <li>
                  <Link href="#thumbnail-section">
                    Thumbnails
                  </Link>
                </li>
                <li>
                  <Link href="#cards-section">
                    Creating/Deleting Cards
                  </Link>
                </li>
                <li>
                  <Link href="#card-editor">
                    Editing Cards
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="#gallery">
                The Gallery Page
              </Link>
            </li>
            <li>
              <Link href="#accounts">
                The Accounts Page
              </Link>
            </li>
            <li>
              <Link href="#reporting-a-bug">
                Reporting an Issue with the Site
              </Link>
            </li>
          </ul>
        </section>
        <section id="dashboard">
          <h2>The Exhibits Page</h2>
          <Image
            src="/help/dashboard-screenshot.png"
            alt="Screenshot of the dashboard page"
            width={1000}
            height={1000}
            className={styles.screenshot}
          />
          <p>
            On this page, you can manage and create exhibits. Each exhibit is represented by a 
            tile, and each tile has a number of buttons that allow you to perform actions on the
            exhibit.
          </p>
          <ul>
            <li>
              <button>Delete</button> will prompt you to delete the exhibit, as you might expect. This action
              is irreversible, so you will generally want to unpublish the exhibit instead. Note that deleting
              an exhibit does <em>not</em> delete the media files associated with it. Image deletion is only allowed throgh the              <Link href="#gallery">Gallery page</Link>.
            </li>
            <li>
              <button>Unpublish</button> will prompt you to unpublish the exhibit. This will hide
              it from the <Link href="/" target="_blank">public page</Link> that guests see. When you create a new exhibit, it will be
              unpublished by default.
            </li>
            <li>
              <button>Edit</button> will open the exhibit in the <Link href="#designer">Designer page</Link>,
              allowing you to edit its contents.
            </li>
            <li>
              <button>View Details</button> will provide information about the exhibit, including a list
              of its related media files, its title, and its &quot;priority&quot;. The priority of an exhibit
              determines the order in which it appears on the guests homepage. High priority exhibits will
              appear first, and low priority exhibits will appear last. Exhibits with the same priority
              are sorted alphabetically.
            </li>
            <li>
              <Image 
                width={24} 
                height={24} 
                style={{
                  margin: "0p 5px -7px 5px",
                  padding: "3px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
                src="/open.svg" 
                alt="an open icon"
              />
              is the final button on exhibit tiles, found in the top-right corner. Clicking it will open a preview
              of the exhibit that shows what guests will see when they open it. The
              preview can also be opened by clicking on the title of the exhibit.
            </li>
          </ul>
          <p>
            At the bottom-right corner of the page is a button that allows you to create a new exhibit.
          </p>
          <Image
            src="/plus.svg"
            alt="a plus sign"
            width={100}
            height={100}
            className={styles.screenshot + " " + styles.plus}
          />
          <p>
            Clicking this button will prompt you to choose a name for the new exhibit.
            Note that each exhibit must have a unique name.
          </p>
        </section>
        <section id="designer">
          <h2>The Designer Page</h2>
          <p>
            This page lets you edit your exhibits. Remember to save your changes before leaving the page, by clicking 
            the 
            <button className={styles.saveButton}>
              Save
              <Image
                className={styles.icon}
                src="/save.svg"
                width={16}
                height={16}
                style={{ marginLeft: "10px", marginBottom: "-3px" }}
                alt=""
              />
            </button>
            button at the top-right corner of the page
          </p>
          <ul>
            <li>
              <Link href="#thumbnail-section">
                Thumbnails
              </Link>
            </li>
            <li>
              <Link href="#cards-section">
                Creating/Deleting Cards
              </Link>
            </li>
            <li>
              <Link href="#card-editor">
                Editing Cards
              </Link>
            </li>
          </ul>
          <Image
            src="/help/designer-screenshot.png"
            alt="Screenshot of the designer page"
            width={1000}
            height={1000}
            className={styles.screenshot}
          />
          <h3 id="thumbnail-section">The Thumbnail Section</h3>
          <p>
            This page has two important sections. The first, at the top of the page, is where you can edit the
            title, thumbnail image, and summary of the exhibit. These items appear on the homepage, but not when
            actually viewing the exhibit. The title and summary are standard text inputs, and the thumbnail image can be
            changed by clicking on it.
          </p>
          <Image
            src="/help/designer-thumbnail-section-screenshot.png"
            alt="Screenshot of the thumbnail section of the designer page"
            width={1000}
            height={1000}
            className={styles.screenshot}
          />
          <p>
            Note that, unlike media used for cards, the thumbnail image will always be expanded to fill the necessary
            space on the homepage. This means that it should be high-resolution and should be a suitable backdrop.
            E.g., a landscape, or a portrait with a lot of empty space.
          </p>
          <h3 id="cards-section">The Cards Section</h3>
          <p>
            The second section of the designer page is a number of tiles that represent the cards in the exhibit. This
            is the content that is actually displayed when a guest opens it.
          </p>
          <Image
            src="/help/designer-cards-section-screenshot.png"
            alt="Screenshot of the thumbnail section of the designer page"
            width={1000}
            height={1000}
            className={styles.screenshot}
          />
          <p>
            Each tile has two buttons that allow you to perform actions on the card.
          </p>
          <ul>
            <li>
              <button>Delete</button> will prompt you to delete the card. This action is irreversible, so be sure that you&apos;re deleting the correct card.
            </li>
            <li>
              Clicking 
              <button>Edit</button>,  
              <Image 
                width={24} 
                height={24} 
                style={{
                  margin: "0px 5px -7px 5px",
                  padding: "3px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
                src="/edit.svg" 
                alt="an open icon"
              />,
              or anywhere else on the tile (except for the delete button) will open up the card editor where
              you can change the contents.
            </li>
          </ul>
          <p>
            In addition to those two buttons, you also have a button in the bottom-right corner of the page
            that adds a new card to the exhibit.
          </p>
          <Image
            src="/plus.svg"
            alt="a plus sign"
            width={100}
            height={100}
            className={styles.screenshot + " " + styles.plus}
          />
          <h3 id="card-editor">The Card Editor</h3>
          <Image
            src="/help/designer-card-editor-screenshot.png"
            alt="Screenshot of the card editor"
            width={1000}
            height={1000}
            className={styles.screenshot}
          />
          <p>
            The card editor, shown above, has two sections. The first is the media, which can be changed by clicking on it.
            The second is the text, which can also be edited directly. There are also a pair of arrows on either side of the
            card editor which allow you to cycle through the cards in the exhibit.
          </p>
          <p>
            Selecting media for the card is done in the same way as selecting media for the thumbnail (i.e., just click it and then use the prompts), except that you also have
            the option of selecting a YouTube video. If you select a YouTube video, then the media in the card editor will be
            replaced with an embedded YouTube player. Clicking on this player will only toggle the play/pause controls,
            so to change the media from a YouTube video you can click the 
            <Image 
              width={24} 
              height={24} 
              style={{
                margin: "0px 5px -7px 5px",
                padding: "3px",
                backgroundColor: "rgba(0, 0, 0, 0.5)"
              }}
              src="/edit.svg" 
              alt="an open icon"
            />
            icon in the top-right corner instead.
          </p>
          <p>
            When selecting a YouTube video, you will be prompted to enter the video&apos;s URL. This can be done by copying it from
            the address bar of your browser, or by clicking the &quot;Share&quot; button on the YouTube video page and then clicking &quot;Copy&quot;.
            Once you have the URL, you can paste it into the prompt and click <button style={{ width: "200px" }}>Use YouTube Video</button>.
          </p>
          <Image
            src="/help/youtube-form-good.png"
            alt="Screenshot of a good YouTube URL"
            width={300}
            height={500}
            className={styles.screenshot}
          />
          <p>
            This button won&apos;t work if you entered an invalid URL, and the input field will turn red that the URL is bad.
          </p>
          <Image
            src="/help/youtube-form-bad.png"
            alt="Screenshot of a bad YouTube URL"
            width={300}
            height={500}
            className={styles.screenshot}
          />
        </section>
        <section id="gallery">
          <h2>The Gallery Page</h2>
          <Image
            src="/help/gallery-screenshot.png"
            alt="Screenshot of the gallery page"
            width={1000}
            height={1000}
            className={styles.screenshot}
          />
          <p>
            This page is where you can view all of the images that you&apos;ve previously uploaded to the site. You can delete, download,
            or upload new images from here. The <button>Delete</button> and <button>Download</button> buttons are self-explanatory,
            but you also have the ability to click on the image itself to view more details about it.
          </p>
          <Image
            src="/help/image-details.png"
            alt="Screenshot of the image details popup"
            width={400}
            height={1000}
            className={styles.screenshot}
          />
          <p>
            In addition to displaying a larger and uncropped version of the image, this popup also lists any exhibits that are currently using
            the image. I would strongly recommend that you only delete an image if no exhibits are using it. Due to image caching, deleting an
            image that is in-use won&apos;t immediately remove it from the exhibit, but it will eventually be removed and then the users won&apos;t
            be able to see it.
          </p>
          <p>
            As with the other pages, there is also a button in the bottom-right corner of the page that allows you to upload a new image.
          </p>
          <Image
            src="/plus.svg"
            alt="a plus sign"
            width={100}
            height={100}
            className={styles.screenshot + " " + styles.plus}
          />
        </section>
        <section id="accounts">
          <h2>The Accounts Page</h2>
          {
            userData.isMaster ?
              <>
                <Image
                  src="/help/admin-accounts-screenshot.png"
                  alt="Screenshot of the gallery page"
                  width={1000}
                  height={1000}
                  className={styles.screenshot}
                />    
                <p>
                  From this page, you can view the email and account details of all users. As the admin user, you also have the exclusive ability to delete another user&apos;s account with <button>Delete</button>, or reset their password with
                  <button style={{ width: "140px", marginLeft: "5px" }}>Reset Password</button>. Additionally, you can create other users by clicking the button in the bottom-right corner.
                </p>
                <Image
                  src="/plus.svg"
                  alt="a plus sign"
                  width={100}
                  height={100}
                  className={styles.screenshot + " " + styles.plus}
                />
                <p>
                  If you click on your own account details, a form will open that lets you change your account
                  details. Any fields you leave empty on this form will remain unchanged.  
                </p>   
                <Image
                  src="/help/account-details-form.png"
                  alt="Screenshot of the gallery page"
                  width={500}
                  height={1000}
                  className={styles.screenshot}
                />         
              </>
            :
              <>
                <Image
                  src="/help/nonadmin-accounts-screenshot.png"
                  alt="Screenshot of the gallery page"
                  width={1000}
                  height={1000}
                  className={styles.screenshot}
                />
                <p>
                  On this page, you can view your own account details and the email of other users.
                  The admin user, marked with &quot;&nbsp;(Admin)&quot;, has the ability to create and delete
                  other users. They also have the ability to reset a user&apos;s password, so if you forget
                  your password, you can ask the admin to reset it for you.  
                </p>
                <p>
                  If you click on your own account details, a form will open that lets you change your account
                  details. Any fields you leave empty on this form will remain unchanged.  
                </p>   
                <Image
                  src="/help/account-details-form.png"
                  alt="Screenshot of the gallery page"
                  width={500}
                  height={1000}
                  className={styles.screenshot}
                />         
              </>
          }
        </section>
        <section id="reporting-a-bug">
          <h2>Reporting an Issue</h2>
          <p>
            If you find a bug or other issue with the site, you can report it to me directly by sending an email to <Link href="mailto:chadglazier@outlook.com" target="_blank">chadglazier@outlook.com</Link>.
          </p>
        </section>
      </AdminLayout>
    </>
  )
}