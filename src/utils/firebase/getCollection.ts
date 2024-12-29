import { DocumentData, collection, getDocs } from "firebase/firestore";
import { firestore } from "@/src/firebase/firebase";

export default async function getCollection(path: string) {
  const collectionRef = collection(firestore, path);
  const data: DocumentData[] = [];

  try {
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
}
