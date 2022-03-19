import React, { useState } from "react";
import {
  Flex,
  Heading,
  Avatar,
  IconButton,
  Image,
  Tooltip,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  BiDotsVerticalRounded,
  BiCommentDetail,
  BiEdit,
  BiTrash,
} from "react-icons/bi";
import { BsHeart, BsBookmark } from "react-icons/bs";
import { MdOutlineReportProblem } from "react-icons/md";
import { format } from "timeago.js";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";

type Props = {
  posts?: {
    caption: string;
    createdAt: string;
    image: string;
    userName: string;
    userId: string;
    userPfp: string;
    id: string;
  };
};

const Post = (props: Props) => {
  const auth = getAuth(app);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const db = getFirestore(app);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const deletePost = async () => {
    setLoading(true);
    await deleteDoc(doc(db, "posts", props?.posts?.id as string))
      .then(() => {
        setLoading(false);
        onClose();
        toast({
          title: "Success",
          description: "Post deleted succesfully",
          status: "success",
          duration: 6900,
          isClosable: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        onClose();
        toast({
          title: "Error",
          description: err?.message,
          status: "error",
          duration: 6900,
          isClosable: true,
        });
      });
  };
  return (
    <Flex
      flexDirection="column"
      padding="1rem"
      width="100%"
      boxShadow="lg"
      borderRadius="md"
      gap="1rem"
      marginBottom="0.7rem"
    >
      <Flex flexDirection="row" width="100%" alignItems="center">
        <Tooltip label={props?.posts?.userName} openDelay={200}>
          <Avatar cursor="pointer" src={props?.posts?.userPfp} />
        </Tooltip>
        <Flex
          flexDirection="column"
          width="100%"
          marginLeft="1rem"
          gap="0.2rem"
        >
          <Heading as="h3" size="md">
            {props?.posts?.userName}
          </Heading>
          <Heading as="h4" size="sm" color="gray.600">
            {/* @ts-ignore */}
            {format(props?.posts?.createdAt?.toDate())}
          </Heading>
        </Flex>
        {props?.posts?.userId === auth?.currentUser?.uid ? (
          <Menu>
            <MenuButton>
              <IconButton
                icon={<BiDotsVerticalRounded size="1.6rem" />}
                aria-label="Shit"
              />
            </MenuButton>
            <MenuList>
              <MenuItem gap="0.5rem">
                <BiEdit size={20} color="#90CDF4" />
                <Heading as="h4" size="sm" color="#90CDF4">
                  Edit
                </Heading>
              </MenuItem>
              <MenuItem gap="0.5rem" onClick={onOpen}>
                <BiTrash size={20} color="red" />
                <Heading as="h4" size="sm" color="red">
                  Delete
                </Heading>
              </MenuItem>
            </MenuList>
            <AlertDialog
              isOpen={isOpen}
              //@ts-ignore
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Post
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    {loading === true ? (
                      ""
                    ) : (
                      //@ts-ignore
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      colorScheme="red"
                      onClick={deletePost}
                      ml={3}
                      isLoading={loading}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Menu>
        ) : (
          <></>
        )}
      </Flex>
      <Image src={props?.posts?.image} alt="" borderRadius="lg" />
      <Heading as="h5" size="sm">
        {props?.posts?.caption}
      </Heading>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap="1.3rem">
          <Flex alignItems="center" gap="0.4rem">
            <IconButton aria-label="Like" isRound={true}>
              <BsHeart size="1.5rem" cursor="pointer" />
            </IconButton>
            <Heading as="h5" size="sm" color="gray.600">
              0
            </Heading>
          </Flex>
          <Flex alignItems="center" gap="0.4rem">
            <IconButton aria-label="Comment" isRound={true}>
              <BiCommentDetail size="1.5rem" cursor="pointer" />
            </IconButton>
            <Heading as="h5" size="sm" color="gray.600">
              0
            </Heading>
          </Flex>
          <Flex alignItems="center" gap="0.4rem">
            <IconButton aria-label="Comment" isRound={true}>
              <MdOutlineReportProblem size="1.5rem" cursor="pointer" />
            </IconButton>
          </Flex>
        </Flex>
        <IconButton aria-label="Comment" isRound={true}>
          <BsBookmark size="1.5rem" cursor="pointer" />
        </IconButton>
      </Flex>
      <Heading
        as="h5"
        size="sm"
        color="gray.500"
        cursor="pointer"
        _hover={{
          textDecorationLine: "underline",
        }}
      >
        View all comments
      </Heading>
    </Flex>
  );
};

export default Post;
