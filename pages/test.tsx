import { ApiClient } from "@/util/client";

export default function Test() {
  return (
    <div>
      <h1>Test</h1>
      <button onClick={testRun}>Run Tests</button>
    </div>
  )
}

async function testRun() {
  await ApiClient.user.put({ email: "admin2@museum.ca", password: "pass", name: "Admin2" });
  await ApiClient.user.getAll();  
  await ApiClient.user.getOne("admin@museum.ca");
  await ApiClient.user.authenticate("admin@museum.ca", "pass");
  await ApiClient.user.authentic();
  await ApiClient.user.deleteOne("admin2@museum.ca");
  await ApiClient.exhibit.put({
    published: false,
    title: "Look at this Dog", 
    thumbnail: "https://cdn.akc.org/content/article-body-image/lab_puppy_dog_pictures.jpg",
    summary: "he's so fluffy!", 
    cards: [
      {
        title: "Another Dog",
        media: "https://cdn.akc.org/content/article-body-image/golden_puppy_dog_pictures.jpg",
        description: "This is another dog",      
      }
    ] 
  });
  await ApiClient.exhibit.getOne("Look at this Dog");
  await ApiClient.exhibit.getAll();
  await ApiClient.exhibit.deleteOne("Look at this Dog");
}