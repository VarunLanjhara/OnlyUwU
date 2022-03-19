import { Avatar, Divider, Flex, Heading, Tag, Tooltip } from "@chakra-ui/react";
import React from "react";
import Post from "./Post";

type Posts = {
  caption: string;
  createdAt: string;
  image: string;
  userName: string;
  userId: string;
  userPfp: string;
  id: string;
};

type Props = {
  isExplore: boolean;
  isLibrary: boolean;
  isYourPosts: boolean;
  isSearch: boolean;
  isProfile: boolean;
  isFollower: boolean;
  username?: string;
  homePosts?: Array<Posts>;
};

const Feed = (props: Props) => {
  return props?.isExplore ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Trending posts
      </Heading>
      <Post />
      <Post />
      <Post />
      <Post />
    </Flex>
  ) : props.isLibrary ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Liked posts
      </Heading>
      <Post />
      <Post />
      <Divider />
      <Heading as="h4" size="md">
        Saved posts
      </Heading>
      <Post />
      <Post />
    </Flex>
  ) : props?.isYourPosts ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Your posts
      </Heading>
      <Post />
      <Post />
      <Post />
      <Post />
    </Flex>
  ) : props?.isSearch ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Search results
      </Heading>
      <Post />
      <Post />
      <Post />
      <Post />
    </Flex>
  ) : props?.isProfile ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        {props?.username} posts
      </Heading>
      <Post />
      <Post />
      <Post />
      <Post />
    </Flex>
  ) : props?.isFollower ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Flex gap="2rem" alignItems="center" flexWrap="wrap" marginBottom="1rem">
        <Tooltip label="Your mom" openDelay={400}>
          <Avatar width="16" height="16" cursor="pointer" />
        </Tooltip>
        <Tooltip label="Your uncle" openDelay={400}>
          <Avatar width="16" height="16" cursor="pointer" />
        </Tooltip>
        <Tooltip label="Your dad" openDelay={400}>
          <Avatar width="16" height="16" cursor="pointer" />
        </Tooltip>
        <Tooltip label="Branu" openDelay={400}>
          <Avatar width="16" height="16" cursor="pointer" />
        </Tooltip>
        <Tooltip label="Tim" openDelay={400}>
          <Avatar width="16" height="16" cursor="pointer" />
        </Tooltip>
        <Tooltip label="Tim mom" openDelay={400}>
          <Avatar width="16" height="16" cursor="pointer" />
        </Tooltip>
      </Flex>
      <Heading as="h4" size="md">
        Your followers post
      </Heading>
      <Post />
      <Post />
      <Post />
      <Post />
    </Flex>
  ) : (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Flex gap="1rem" width="100%" flexWrap="wrap">
        <Tag>Gaming</Tag>
        <Tag>Programming</Tag>
        <Tag>Movies</Tag>
        <Tag>Music</Tag>
        <Tag>Anime</Tag>
        <Tag>YourMom</Tag>
        <Tag>Idk</Tag>
        <Tag>What</Tag>
        <Tag>Else</Tag>
        <Tag>To</Tag>
        <Tag>Write</Tag>
        <Tag>Lol</Tag>
      </Flex>
      {props?.homePosts?.map((post, index) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  );
};

export default Feed;
