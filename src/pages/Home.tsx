import { Grid, useToast } from "@chakra-ui/react";
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

const Home = () => {
  const toast = useToast();
  const db = getFirestore(app);
  useEffect(() => {
    document.title = "OnlyUwU";
  }, []);
  const [posts, setPosts] = useState([]);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc"));
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
  }, []);
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
          isFollower={false}
          homePosts={posts}
        />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Home;
