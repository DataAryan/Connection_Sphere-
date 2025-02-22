import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { User } from "@shared/schema";

const RELIEVERS_COLLECTION = "relievers";

export const relieverService = {
  async createReliever(reliever: Omit<User, "id">): Promise<User> {
    try {
      // First create the Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        reliever.username, // Using username as email since we're storing email
        reliever.password
      );

      // Then create the reliever document
      const docRef = await addDoc(collection(db, RELIEVERS_COLLECTION), {
        ...reliever,
        firebaseUid: userCredential.user.uid,
        createdAt: new Date(),
        online: false
      });

      console.log("Created new reliever with ID:", docRef.id);

      return {
        id: parseInt(docRef.id),
        ...reliever,
        createdAt: new Date(),
        online: false
      };
    } catch (error) {
      console.error("Error creating reliever:", error);
      throw error;
    }
  },

  async getRelievers(): Promise<User[]> {
    try {
      console.log("Fetching relievers from Firestore");
      const querySnapshot = await getDocs(collection(db, RELIEVERS_COLLECTION));
      const relievers = querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as User[];

      console.log("Fetched relievers:", relievers);
      return relievers;
    } catch (error) {
      console.error("Error fetching relievers:", error);
      return [];
    }
  },

  async updateRelieverStatus(id: string, online: boolean): Promise<void> {
    try {
      const relieverRef = doc(db, RELIEVERS_COLLECTION, id);
      await updateDoc(relieverRef, { online });
      console.log("Updated reliever status:", id, online);
    } catch (error) {
      console.error("Error updating reliever status:", error);
      throw error;
    }
  }
};