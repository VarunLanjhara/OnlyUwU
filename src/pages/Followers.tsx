import { Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";
import Feed from "../components/Feed";
import LeftSidebar from "../components/LeftSidebar";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const Followers = () => {
  useEffect(() => {
    document.title = "OnlyUwU - Followers";
  }, []);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [followers, setFollowers] = useState<DocumentData | undefined>(
    undefined
  );
  const userRef = collection(
    db,
    "users",
    auth?.currentUser?.uid as string,
    "followers"
  );
  const getFollowers = async () => {
    onSnapshot(userRef, (snapshot) => {
      const followers = snapshot?.docs?.map((doc) => ({
        ...doc.data(),
      }));
      setFollowers(followers);
    });
  };
  useEffect(() => {
    getFollowers();
  }, [db, auth?.currentUser?.uid]);
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
          isProfile={false}
          isFollower={true}
          followersData={followers}
        />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Followers;
