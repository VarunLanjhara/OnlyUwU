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
} from "firebase/firestore";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";

const Library = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  useEffect(() => {
    document.title = "OnlyUwU - Library";
  }, []);
  const [posts, setPosts] = useState([]);
  const postsRef = collection(
    db,
    "users",
    auth?.currentUser?.uid as string,
    "savedposts"
  );
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const getPosts = async () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //@ts-ignore
      setPosts(posts);
    });
  };
  useEffect(() => {
    getPosts();
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
          isLibrary={true}
          isYourPosts={false}
          isSearch={false}
          isProfile={false}
          isFollower={false}
          libraryPosts={posts}
        />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Library;
