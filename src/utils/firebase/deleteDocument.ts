import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/src/firebase/firebase";

export default async function deleteDocument(
  collectionName: string,
  documentId: string
) {
  try {
    const documentRef = doc(firestore, collectionName, documentId);
    await deleteDoc(documentRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}
