import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/src/firebase/firebase";

export default async function uploadDocument(
  collectionName: string,
  data: object
): Promise<string> {
  const collectionRef = collection(firestore, collectionName);

  return addDoc(collectionRef, data)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      throw error;
    });
}
