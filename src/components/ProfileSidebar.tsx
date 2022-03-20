import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { MdShare, MdContentCopy } from "react-icons/md";
import { format } from "timeago.js";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
  RedditShareButton,
  RedditIcon,
  FacebookIcon,
  FacebookShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import {
  doc,
  getDoc,
  getFirestore,
  DocumentData,
  collection,
  orderBy,
  query,
  onSnapshot,
  where,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

type Props = {
  username: string;
  bio: string;
  createdAt: string;
  pfp: string;
  uid: string;
};

const ProfileSidebar = (props: Props) => {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const toast = useToast();
  const SHARE_URL = "http://localhost:3000/profile/" + props.uid;
  const copyClipboard = () => {
    navigator.clipboard.writeText(SHARE_URL);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };
  const [following, setFollowing] = useState(false);
  const getFollowing = async () => {
    const docboi = await getDoc(
      doc(
        db,
        "users",
        props?.uid as string,
        "followers",
        auth?.currentUser?.uid as string
      )
    );
    if (docboi.exists()) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  };
  useEffect(() => {
    getFollowing();
  }, [db, following, auth?.currentUser?.uid, props?.uid]);
  const [followLoading, setFollowLoadig] = useState(false);
  const followUser = async () => {
    setFollowLoadig(true);
    if (following) {
      await deleteDoc(
        doc(
          db,
          "users",
          props?.uid as string,
          "followers",
          auth?.currentUser?.uid as string
        )
      )
        .then(() => {
          setFollowLoadig(false);
          setFollowing(false);
          toast({
            title: "Unfollowed",
            description: `You are no longer following ${props?.username}`,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          setFollowLoadig(false);
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 6900,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "users",
          props?.uid,
          "followers",
          auth?.currentUser?.uid as string
        ),
        {
          username: props.username,
        }
      )
        .then(() => {
          setFollowLoadig(false);
          setFollowing(true);
          toast({
            title: "Followed",
            description: `You are now following ${props?.username}`,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          setFollowLoadig(false);
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 6900,
            isClosable: true,
          });
        });
    }
  };
  const [followersList, setFollowersList] = useState<DocumentData | undefined>(
    undefined
  );
  useEffect(() => {
    onSnapshot(
      collection(db, "users", props?.uid as string, "followers"),
      (snapshot) => {
        const followers = snapshot?.docs?.map((doc) => ({
          ...doc.data(),
        }));
        setFollowersList(followers);
      }
    );
  }, [db, auth?.currentUser?.uid]);
  return (
    <Flex
      width="100%"
      height="max-content"
      flexDirection="column"
      boxShadow="lg"
      alignItems="center"
      position="sticky"
      top="23%"
      gap="1rem"
    >
      <Tooltip label={props?.username} openDelay={200}>
        <Avatar
          src={props?.pfp}
          width="40"
          height="40"
          cursor="pointer"
          marginTop="1rem"
        />
      </Tooltip>
      <Heading as="h3" size="lg" marginRight="2rem" marginLeft="2rem">
        {props?.username}
      </Heading>
      <Heading as="h3" size="md" marginRight="2rem" marginLeft="2rem">
        {props?.bio}
      </Heading>
      <Flex alignItems="center" width="100%" gap="2rem" justifyContent="center">
        <Flex alignItems="center" flexDirection="column" gap="0.4rem">
          <Heading as="h4" size="md">
            Followers
          </Heading>
          <Heading as="h4" size="sm">
            {followersList?.length}
          </Heading>
        </Flex>
        <Flex alignItems="center" flexDirection="column" gap="0.4rem">
          <Heading as="h4" size="md">
            Posts
          </Heading>
          <Heading as="h4" size="sm">
            0
          </Heading>
        </Flex>
      </Flex>
      <Flex alignItems="center" gap="1rem">
        {auth?.currentUser?.uid === props?.uid ? (
          ""
        ) : following ? (
          <Button
            colorScheme="purple"
            variant="solid"
            leftIcon={<RiUserUnfollowFill />}
            onClick={followUser}
            isLoading={followLoading}
          >
            UnFollow
          </Button>
        ) : (
          <Button
            colorScheme="purple"
            variant="solid"
            leftIcon={<RiUserFollowFill />}
            onClick={followUser}
            isLoading={followLoading}
          >
            Follow
          </Button>
        )}
        <Menu>
          <MenuButton>
            <Button colorScheme="purple" variant="solid" leftIcon={<MdShare />}>
              Share
            </Button>
          </MenuButton>
          <MenuList>
            <MenuItem gap="0.5rem" onClick={copyClipboard}>
              <MdContentCopy
                size="1.5rem"
                style={{
                  marginLeft: "0.1rem",
                }}
              />
              Copy to clipboard
            </MenuItem>
            <MenuItem gap="0.5rem">
              <RedditShareButton url={SHARE_URL}>
                <RedditIcon size={32} round />
              </RedditShareButton>
              Reddit
            </MenuItem>
            <MenuItem gap="0.5rem">
              <FacebookShareButton url={SHARE_URL}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              Facebook
            </MenuItem>
            <MenuItem gap="0.5rem">
              <WhatsappShareButton url={SHARE_URL}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              Whatsapp
            </MenuItem>
            <MenuItem gap="0.5rem">
              <TwitterShareButton url={SHARE_URL}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              Twitter
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Heading marginBottom="1rem" as="h4" size="sm">
        {/* @ts-ignore */}
        Joined {format(props?.createdAt?.toDate())}
      </Heading>
    </Flex>
  );
};

export default ProfileSidebar;
