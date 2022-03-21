import React, { useState, useEffect } from "react";
import { Flex, Avatar, Heading, Button, Skeleton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";

type Props = {
  userPfp: string;
  userId: string;
  userName: string;
};

const WhoToFollow = (props: Props) => {
  const [usersLoading, setusersLoading] = useState(false);
  const auth = getAuth(app);
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore(app);
  const getFollowing = async () => {
    await getDoc(
      doc(
        db,
        "users",
        props?.userId as string,
        "followers",
        auth?.currentUser?.uid as string
      )
    ).then((doc) => {
      if (doc.exists()) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    });
  };
  useEffect(() => {
    getFollowing();
  }, [db, props?.userId, auth?.currentUser?.uid]);
  return (
    <Flex justifyContent="space-between">
      <Flex flexDirection="row" gap="0.6rem" alignItems="center">
        <Avatar
          cursor="pointer"
          src={props?.userPfp}
          onLoad={() => {
            setusersLoading(false);
          }}
          onClick={() => {
            navigate("/profile/" + props?.userId);
          }}
        />
        {!usersLoading ? (
          <Heading as="h5" size="sm">
            {props?.userName}
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
            navigate("/profile/" + props?.userId);
          }}
        >
          {following ? "UnFollow" : "Follow"}
        </Button>
      ) : (
        <Skeleton width="5rem" height="3rem" />
      )}
    </Flex>
  );
};

export default WhoToFollow;
