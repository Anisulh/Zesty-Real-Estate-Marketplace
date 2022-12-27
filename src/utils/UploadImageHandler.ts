import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { Auth } from "firebase/auth";

export const storeImage = async (auth:Auth, image: any) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;

    const storageRef = ref(storage, "images/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};