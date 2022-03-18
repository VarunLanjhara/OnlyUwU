import { Grid, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";
import Feed from "../components/Feed";
import ProfileSidebar from "../components/ProfileSidebar";
import { useParams } from "react-router-dom";
import { doc, getDoc, getFirestore, DocumentData } from "firebase/firestore";
import { app } from "../firebase";
import Loader from "../components/Loader";

const Profile = () => {
  const [profile, setProfile] = useState<DocumentData | undefined>(undefined);
  useEffect(() => {
    document.title = `OnlyUwU - ${profile?.username}`;
  }, [profile]);
  const { uuid } = useParams();
  const db = getFirestore(app);
  const toast = useToast();
  const getProfile = async () => {
    //@ts-ignore
    const docboi = await getDoc(doc(db, "users", uuid));
    if (docboi.exists()) {
      setProfile(docboi.data());
    } else {
      toast({
        title: "Error",
        description: "No user found :(",
        status: "error",
        duration: 6900,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    getProfile();
  }, [uuid]);
  if (profile === undefined) {
    return <Loader />;
  }
  return (
    <div>
      <Navbar />
      <Grid
        gridTemplateColumns="22vw auto 24vw"
        columnGap="2rem"
        marginLeft="1rem"
        marginRight="1rem"
      >
        <RightSidebar />
        <Feed
          isExplore={false}
          isLibrary={false}
          isYourPosts={false}
          isSearch={false}
          isProfile={true}
          isFollower={false}
          username={profile?.username}
        />
        <ProfileSidebar
          username={profile?.username}
          bio={profile?.bio}
          createdAt={profile?.createdAt}
        />
      </Grid>
    </div>
  );
};

export default Profile;
