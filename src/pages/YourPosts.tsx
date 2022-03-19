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
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const YourPosts = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  useEffect(() => {
    document.title = "OnlyUwU - YourPosts";
  }, []);
  const [posts, setPosts] = useState([]);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", auth?.currentUser?.uid));
  const getPosts = async () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      ///@ts-ignore
      setPosts(posts);
    });
  };
  useEffect(() => {
    getPosts();
  }, [auth]);
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
          isYourPosts={true}
          isSearch={false}
          isProfile={false}
          isFollower={false}
          yourPosts={posts}
        />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default YourPosts;
