import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
  IonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProfile: React.FC = () => {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.username || "");
        setProfilePicture(data.profilePic || "");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      username: name,
      profilePic: profilePicture,
    });
    setLoading(false);
    alert("Profile updated!");
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePicture(downloadURL); // Update state
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Something went wrong while uploading image.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Edit Profile</h2>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Updating..." />

        <IonAvatar
          className="profile-avatar"
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{ cursor: "pointer", margin: "0 auto" }}
        >
          <img
            src={
              profilePicture ||
              "https://i.pinimg.com/736x/dc/4d/ee/dc4dee07ee34def633b005817464d384.jpg"
            }
            alt="Profile Pic"
          />
        </IonAvatar>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />

        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            value={name}
            placeholder="Enter your name"
            onIonChange={(e) => setName(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleSave} style={{ marginTop: "1.5rem" }}>
          Save Changes
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
