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
        <h1 className={styles.heading}>User Manual</h1>
        <ul className={styles.tableOfContents}>
          <li>
            <Link className={styles.link} href="#create">Creating Exhibits</Link>
          </li>
          <li>
            <Link className={styles.link} href="#design">Designing Exhibits</Link>
          </li>
          <li>
            <Link className={styles.link} href="#manage-exhibits">Managing Exhibits</Link>
          </li>
          <li>
            <Link className={styles.link} href="#manage-images">Managing Images</Link>
          </li>
          <li>
            <Link className={styles.link} href="#manage-accounts">Managing Accounts</Link>
          </li>
          <li>
            <Link className={styles.link} href="#report">Report a Bug</Link>
          </li>
        </ul>
        <section id="create" className={styles.section}>
          <h2 className={styles.subheading}>Creating Exhibits</h2>
          <p>
            From the Dashboard page, click the &quot;Create Exhibit&quot; button at the bottom of the screen.
          </p>
          <Image 
            className={styles.screenshot}
            src="/manual/create-exhibit-button.png" 
            height={500} 
            width={1000} 
            alt="screenshot" 
          />
          <p>
            There, you will be prompted to enter the name of the new exhibit. Note that exhibits must
            have unique names, so you will not be able to create an exhibit with the same name as an
            existing one. 
          </p>
          <Image 
            className={styles.screenshot}
            src="/manual/create-exhibit-prompt.png" 
            height={500} 
            width={1000} 
            alt="screenshot" 
          />
          <p>
            Once you have entered a valid name, click &quot;Create&quot; to create the exhibit.
            The exhibit should immediately appear on the Dashboard.              
          </p>
          <p>
            Another way to create exhibits is by navigating to the <Link href="/designer" className={styles.link}>
            Designer page</Link>. From there, you will have the choice of either creating a new exhibit in the designer,
            or opening an existing one. By default, the selected option is to create a new exhibit, so you can just
            enter the desired title and then click &quot;Create&quot; to create the exhibit. Then the designer will open for
            the new exhibit.
          </p>
          <Image 
            className={styles.screenshot}
            src="/manual/create-exhibit-designer.png" 
            height={500} 
            width={1000} 
            alt="screenshot" 
          />
        </section>
        <section id="design" className={styles.section}>
          <h2 className={styles.subheading}>Designing Exhibits</h2>
          <p>
            In order to design an exhibit, you can open it in the Designer page. This can be done by either
            navigating to the <Link href="/designer" className={styles.link}>Designer page</Link> and selecting the
            exhibit to open,
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/designer-open.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            or by clicking on the &quot;Edit&quot; button on the Dashboard page.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/edit-button.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            Once you have the editor open, you&apos;ll have a number of options for designing your exhibit. The
            buttons in the top right corner of the screen allow you to save the exhibit, preview the last saved
            version in a new tab, or exit the designer page and return to the Dashboard.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/designer-buttons.png"
            height={500}
            width={1000}
            style={{ maxWidth: "300px" }}
            alt="screenshot"
          />
          <p>
            The first section of the designer includes the content that will be visible from the exhibit browser
            page. This includes the title, summary, and thumbnail.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/designer-content.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            The title and summary are both text editors, and you can change the thumbnail by clicking on it. This
            will show a popup that lets you decide whether to upload a new image from your machine, or to select
            an image that you&apos;ve previously uploaded.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/thumbnail-edit.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            Note that this content (the thumbnail, summary, and title) will not be included as content in the actual
            exhibit page. It is only used for the exhibit browser page. To add content to the exhibit, you must include
            &quot;Card&quot;s.
            <br />
            This can be done by clicking on the &quot;Add Card&quot; button at the bottom of the designer page. The new
            card should appear at the bottom of the editor:
          </p>
          <Image  
            className={styles.screenshot}
            src="/manual/card.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            You can then edit the card&apos;s media and text content. The media content can be either an image or a link to
            a YouTube video that you want to embed. Note that the ability to link to YouTube videos is only available for cards,
            not the thumbnail of an exhibit.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/add-card-media.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            Try adding some cards and editing their content, then save the exhibit and preview it in a new tab (via the buttons at
            the top of the page) to get a feel for how the cards will be presented. Note that newly-created exhibits are hidden from
            the public until you set them to be public, so feel free to experiment.
          </p>
          <p>
            The order that cards appear in an exhibit is determined by their order in the designer. You can change the order of cards 
            clicking the arrows on the right side of the card. Additionally, clicking the &quot;X&quot; button will prompt you to delete
            the card. Remember that, if you accidentally delete the wrong card, you can always refresh the page to discard your changes
            and revert to the last saved version.
          </p>
        </section>
        <section id="manage-exhibits" className={styles.section}>
          <h2 className={styles.subheading}>Managing Exhibits</h2>
          <p>
            From the Dashboard page, you can manage your exhibits by using the buttons on the bottom of each exhibits tile. 
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/edit-button.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <ul>
            <li>
              <strong>Edit</strong> - Opens the exhibit in the designer, allowing you to edit it.
            </li>
            <li>
              <strong>Delete</strong> - Prompts you to delete the exhibit permanently (note that, if you do this by accident, the exhibit can most likely be recovered if you contact me at <Link className={styles.link} target="_blank" href="mailto:chadglazier@outlook.com">chadglazer@outlook.com</Link>).
            </li>
            <li>
              <strong>(Un)Publish</strong> - Prompts you to (un)publish the exhibit. If you unpublish an exhibit, it will no longer be visible to the public. If you publish an exhibit, it will become visible to the public.
            </li>
            <li>
              <strong>View Details</strong> - Opens a popup that provides more information about the exhibit, and allows you to view a preview, see a list of the media that the exhibit uses (and view their details), and modify the title of the exhibit. Additionally, you can set the &quot;Priority&quot; of the exhibit, which determines the order that exhibits appear in the exhibit browser page. The higher the priority, the closer to the top of the page the exhibit will appear. If two exhibits have the same priority, they will be sorted alphabetically by title.
            </li>
          </ul>
          <Image  
            className={styles.screenshot}
            src="/manual/view-details.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
        </section>
        <section id="manage-images" className={styles.section}>
          <h2 className={styles.subheading}>Managing Images</h2>
          <p>
            As you create exhibits, you will end up uploading a number of images. If you want to view and manage these images, you can do so via the <Link href="/gallery" className={styles.link}>Gallery page</Link>.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/gallery.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            The &quot;Delete&quot; and &quot;Download&quot; buttons are pretty self explanatory, but before you delete an image, it&apos;s probably a good idea to make sure that no exhibits depend on it. You can determine this by clicking on the &quot;View Details&quot; button, which will show you a list of exhibits that use the image. Clicking on one of those exhibits will open their Designer page in a new tab, so you can swap out the image if you need to.
          </p>
          <Image
            className={styles.screenshot}
            src="/manual/image-details.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
          <p>
            You can also upload new images from this page by scrolling to the bottom and clicking &quot;Add Image&quot;.
          </p>
        </section>
        <section id="manage-accounts" className={styles.section}>
          <h2 className={styles.subheading}>Managing Accounts</h2>
          {userData.isMaster ? 
            <>
              <p>
                The <Link className={styles.link} href="/accounts">Accounts page</Link> is where you can view and manage accounts. Since you&apos;re the admin user, you reserve the unique ability to create and delete other accounts. Your account cannot be deleted, though the password can be changed.
              </p>
              <Image
                className={styles.screenshot}
                src="/manual/admin-account-page.png"
                height={500}
                width={1000}
                alt="screenshot"
              />      
              <p>
                Other, non-admin users will see a similar page when they visit the Accounts page, but they will not be able to create or delete accounts.
              </p>      
            </>
            :
            <p>
              From the Accounts page, you can view a list of all accounts. You can also change your password from this page. If a new account must be created, contact the user marked as &quot;(Admin)&quot; in the list.
            </p>
          }
          <Image
            className={styles.screenshot}
            src="/manual/nonadmin-account-page.png"
            height={500}
            width={1000}
            alt="screenshot"
          />
        </section>
        <section id="report" className={styles.section} style={{ paddingBottom: "3rem" }}>
          <h2 className={styles.subheading}>Reporting Issues</h2>
          <p>
            If you encounter a bug or other issue with the website, please contact the developer (me) at <Link className={styles.link} target="_blank" href="mailto:chadglazier@outlook.com">chadglazier@outlook.com</Link>. Try to include as much information about the issue as possible so that I can reproduce it.
          </p>
        </section>
      </AdminLayout>
    </>
  )
}