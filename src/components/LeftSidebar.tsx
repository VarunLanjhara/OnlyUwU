import {
  Avatar,
  Button,
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
  orderBy,
  DocumentData,
  doc,
  where,
  limit,
} from "firebase/firestore";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
  }, []);
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
  const [usersLoading, setusersLoading] = useState(true);
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
      <Flex boxShadow="md" flexDirection="column" padding="1.5rem" width="100%">
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
            <Flex justifyContent="space-between">
              <Flex flexDirection="row" gap="0.6rem" alignItems="center">
                <Avatar
                  cursor="pointer"
                  src={user?.pfp}
                  onLoad={() => {
                    setusersLoading(false);
                  }}
                />
                {!usersLoading ? (
                  <Heading as="h5" size="sm">
                    {user?.username}
                  </Heading>
                ) : (
                  <Skeleton width="5rem" height="1rem" />
                )}
              </Flex>
              {!usersLoading ? (
                <Button
                  colorScheme="purple"
                  variant="solid"
                  onClick={() => {
                    navigate("/profile/" + user?.uid);
                  }}
                >
                  Follow
                </Button>
              ) : (
                <Skeleton width="5rem" height="3rem" />
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex boxShadow="md" flexDirection="column" padding="1.5rem" width="100%">
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
