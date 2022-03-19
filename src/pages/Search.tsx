import { Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";
import Feed from "../components/Feed";
import LeftSidebar from "../components/LeftSidebar";
import { Params, useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { app } from "../firebase";

const Search = () => {
  useEffect(() => {
    document.title = "OnlyUwU - Search results";
  }, []);
  const db = getFirestore(app);
  const { caption }: Readonly<Params<string>> = useParams();
  const [posts, setPosts] = useState([]);
  console.log(posts);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("caption", "==", caption));
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
          isSearch={true}
          isProfile={false}
          isFollower={false}
          searchPosts={posts}
        />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Search;
