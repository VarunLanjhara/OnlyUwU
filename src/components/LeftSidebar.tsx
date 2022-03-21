import {
  Divider,
  Flex,
  Heading,
  Image,
  Skeleton,
  useColorMode,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  DocumentData,
  where,
  limit,
} from "firebase/firestore";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import WhoToFollow from "./WhoToFollow";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const auth = getAuth();
  const db = getFirestore(app);
  const [recommendedPosts, setRecommendedPosts] = useState<
    DocumentData | undefined
  >(undefined);
  const postRef = collection(db, "posts");
  const q = query(
    postRef,
    where("userId", "!=", auth?.currentUser?.uid),
    limit(2)
  );
  const getPosts = async () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecommendedPosts(posts);
    });
  };
  const [postsLoading, setpostsLoading] = useState(true);
  useEffect(() => {
    getPosts();
  }, [db]);
  const [recommendedusers, setRecommendedUsers] = useState<
    DocumentData | undefined
  >(undefined);
  const userRef = collection(db, "users");
  const qUser = query(
    userRef,
    where("uid", "!=", auth?.currentUser?.uid),
    limit(2)
  );
  const getUsers = async () => {
    onSnapshot(qUser, (snapshot) => {
      const users = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecommendedUsers(users);
    });
  };
  useEffect(() => {
    getUsers();
  }, [db]);
  return (
    <Flex
      position="sticky"
      top="5.4rem"
      height="max-content"
      flexDirection="column"
      gap="1rem"
    >
      <Flex
        boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
        flexDirection="column"
        padding="1.5rem"
        width="100%"
      >
        <Flex width="80%" flexDirection="column" gap="0.6rem">
          <Heading as="h4" size="lg">
            Who to follow
          </Heading>
          <Heading
            as="h4"
            size="md"
            color="blue.200"
            cursor="pointer"
            _hover={{
              textDecorationLine: "underline",
            }}
          >
            View more
          </Heading>
          <Divider />
        </Flex>
        <Flex width="100%" flexDirection="column" gap="1rem" marginTop="1rem">
          {recommendedusers?.map((user: any) => (
            <WhoToFollow
              userName={user?.username}
              userId={user?.uid}
              userPfp={user?.pfp}
            />
          ))}
        </Flex>
      </Flex>
      <Flex
        boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
        flexDirection="column"
        padding="1.5rem"
        width="100%"
      >
        <Flex width="80%" flexDirection="column" gap="0.6rem">
          <Heading as="h4" size="lg">
            Recommended posts
          </Heading>
          <Heading
            as="h4"
            size="md"
            color="blue.200"
            cursor="pointer"
            _hover={{
              textDecorationLine: "underline",
            }}
          >
            View more
          </Heading>
          <Divider />
        </Flex>
        <Flex width="100%" flexDirection="column" gap="1rem" marginTop="1rem">
          {recommendedPosts?.map((post: any) => (
            <Flex
              gap="0.4rem"
              padding="0.2rem"
              _hover={{
                cursor: "pointer",
                backgroundColor: colorMode === "light" ? "#efefef" : "#20242a",
              }}
              onClick={() => {
                navigate(`/profile/${post?.userId}`);
              }}
            >
              <Flex flexDirection="row" gap="0.6rem">
                <Image
                  cursor="pointer"
                  src={post?.image}
                  alt=""
                  width="3rem"
                  height="3rem"
                  onLoad={() => setpostsLoading(false)}
                />
              </Flex>
              <Flex flexDirection="column" gap="0.4rem">
                {!postsLoading ? (
                  <Heading as="h5" size="sm">
                    {post?.userName}
                  </Heading>
                ) : (
                  <Skeleton width="16rem" height="1rem" />
                )}
                {!postsLoading ? (
                  <Heading as="h5" size="xs" color="gray.600">
                    {post?.caption}
                  </Heading>
                ) : (
                  <Skeleton width="6rem" height="1.2rem" />
                )}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LeftSidebar;
