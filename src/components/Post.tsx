import React, { useEffect, useState } from "react";
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
  Input,
  SkeletonCircle,
  Skeleton,
  Radio,
  useColorMode,
} from "@chakra-ui/react";
import {
  BiDotsVerticalRounded,
  BiCommentDetail,
  BiEdit,
  BiTrash,
} from "react-icons/bi";
import {
  BsHeart,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
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
import {
  doc,
  deleteDoc,
  getFirestore,
  setDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  getDoc,
  addDoc,
} from "firebase/firestore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

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
  const {
    isOpen: isCommentOpen,
    onOpen: onCommentOpen,
    onClose: onCommentClose,
  } = useDisclosure();
  const auth = getAuth(app);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
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
  const [caption, setCaption] = useState(props?.posts?.caption as string);
  const [image, setImage] = useState(props?.posts?.image);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage(app);
  const navigate = useNavigate();
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setImageUrl(URL.createObjectURL(e?.target?.files[0]));
    //@ts-ignore
    setImage(e?.target?.files[0]);
  };
  const updatePost = async () => {
    if (image === props?.posts?.image) {
      //@ts-ignore
      await setDoc(doc(db, "posts", props?.posts?.id), {
        caption: caption,
        image: image,
        createdAt: serverTimestamp(),
        userId: auth?.currentUser?.uid,
        userName: auth?.currentUser?.displayName,
        userPfp: auth?.currentUser?.photoURL,
      })
        .then(() => {
          toast({
            title: "Success",
            description: "Post updated succesfully",
            status: "success",
            duration: 6900,
            isClosable: true,
          });
          navigate("/");
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 6900,
            isClosable: true,
          });
        });
    } else {
      //@ts-ignore
      const storageRef = ref(storage, `/images/${image.name + Date.now()}`);
      //@ts-ignore
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 6900,
            isClosable: true,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              //@ts-ignore
              await setDoc(doc(db, "posts", props?.posts?.id), {
                caption: caption,
                image: url,
                createdAt: serverTimestamp(),
                userId: auth?.currentUser?.uid,
                userName: auth?.currentUser?.displayName,
                userPfp: auth?.currentUser?.photoURL,
              })
                .then(() => {
                  toast({
                    title: "Success",
                    description: "Post updated succesfully",
                    status: "success",
                    duration: 6900,
                    isClosable: true,
                  });
                  navigate("/");
                })
                .catch((err) => {
                  toast({
                    title: "Error",
                    description: err?.message,
                    status: "error",
                    duration: 6900,
                    isClosable: true,
                  });
                });
            })
            .catch((err) => {
              setLoading(false);
              toast({
                title: "Error",
                description: err?.message,
                status: "error",
                duration: 6900,
                isClosable: true,
              });
            });
        }
      );
    }
  };
  const [loadyboi, setLoadyboi] = useState(true);
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const reportPost = () => {
    onReportClose();
    toast({
      title: "Success",
      description: "Post reported succesfully",
      status: "success",
      duration: 6900,
      isClosable: true,
    });
  };
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    onSnapshot(
      collection(db, "posts", props?.posts?.id as string, "likes"),
      //@ts-ignore
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, props?.posts?.id]);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    setLiked(
      likes.findIndex((like: any) => like?.id === auth?.currentUser?.uid) !== -1
    );
  }, [likes]);
  const likePost = async () => {
    if (liked) {
      await deleteDoc(
        doc(
          db,
          "posts",
          props?.posts?.id as string,
          "likes",
          auth?.currentUser?.uid as string
        )
      )
        .then(() => {
          toast({
            title: "Success",
            description: "Like removed succesfully",
            status: "success",
            duration: 250,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 250,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          props?.posts?.id as string,
          "likes",
          auth?.currentUser?.uid as string
        ),
        {
          username: auth?.currentUser?.displayName,
        }
      )
        .then(() => {
          toast({
            title: "Success",
            description: "Like added succesfully",
            status: "success",
            duration: 250,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 250,
            isClosable: true,
          });
        });
    }
  };
  const [saved, setSaved] = useState(false);
  const getSavedPosts = async () => {
    const docboi = await getDoc(
      doc(
        db,
        "users",
        auth?.currentUser?.uid as string,
        "savedposts",
        props?.posts?.id as string
      )
    );
    if (docboi.exists()) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  };
  useEffect(() => {
    getSavedPosts();
  }, [saved, auth?.currentUser?.uid, props?.posts?.id, db]);
  const savePost = async () => {
    if (saved) {
      await deleteDoc(
        doc(
          db,
          "users",
          auth?.currentUser?.uid as string,
          "savedposts",
          props?.posts?.id as string
        )
      )
        .then(() => {
          setSaved(false);
          toast({
            title: "Success",
            description: "Post unsaved succesfully",
            status: "success",
            duration: 250,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 250,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "users",
          auth?.currentUser?.uid as string,
          "savedposts",
          props?.posts?.id as string
        ),
        {
          caption: props?.posts?.caption,
          image: props?.posts?.image,
          createdAt: props?.posts?.createdAt,
          userId: props?.posts?.userId,
          userName: props?.posts?.userName,
          userPfp: props?.posts?.userPfp,
        }
      )
        .then(() => {
          setSaved(true);
          toast({
            title: "Success",
            description: "Post saved succesfully",
            status: "success",
            duration: 250,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 250,
            isClosable: true,
          });
        });
    }
  };
  const { colorMode } = useColorMode();
  const [comment, setComment] = useState("");
  const [commentLoading, setcommentLoading] = useState(false);
  const commentBoi = async () => {
    setcommentLoading(true);
    await addDoc(
      collection(db, "posts", props?.posts?.id as string, "comments"),
      {
        comment: comment,
        userId: auth?.currentUser?.uid,
        userPfp: auth?.currentUser?.photoURL,
        userName: auth?.currentUser?.displayName,
      }
    )
      .then(() => {
        setcommentLoading(false);
        setComment("");
        toast({
          title: "Success",
          description: "Comment added succesfully",
          status: "success",
          duration: 250,
          isClosable: true,
        });
      })
      .catch((err) => {
        setcommentLoading(false);
        toast({
          title: "Error",
          description: err?.message,
          status: "error",
          duration: 250,
          isClosable: true,
        });
      });
  };
  const [comments, setComments] = useState([]);
  useEffect(() => {
    onSnapshot(
      collection(db, "posts", props?.posts?.id as string, "comments"),
      (snapshot) => {
        const commentsboi = snapshot?.docs?.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));
        //@ts-ignore
        setComments(commentsboi);
      }
    );
  }, []);
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
          {loadyboi ? (
            <SkeletonCircle borderRadius={"100%"} height="12" width="14" />
          ) : (
            <Avatar cursor="pointer" src={props?.posts?.userPfp} />
          )}
        </Tooltip>
        <Flex
          flexDirection="column"
          width="100%"
          marginLeft="1rem"
          gap="0.2rem"
        >
          {loadyboi ? (
            <Skeleton width="20rem" height="1rem" />
          ) : (
            <Heading as="h3" size="md">
              {props?.posts?.userName}
            </Heading>
          )}
          {loadyboi ? (
            <Skeleton width="15rem" height="1rem" />
          ) : (
            <Heading as="h4" size="sm" color="gray.600">
              {/* @ts-ignore */}
              {format(props?.posts?.createdAt?.toDate())}
            </Heading>
          )}
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
              <MenuItem gap="0.5rem" onClick={onEditOpen}>
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
            {/* edit modal stuff */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex width="100%" gap="1rem" flexDirection="column">
                    <Input
                      variant="filled"
                      placeholder="Caption"
                      value={caption}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCaption(e?.target?.value);
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      placeholder="Select post image"
                      onChange={uploadImage}
                    />
                  </Flex>
                  {imageUrl ? (
                    <Image src={imageUrl} alt="" width="100%" />
                  ) : (
                    <Image src={image} alt="" width="100%" />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={onEditClose}>
                    Close
                  </Button>
                  {caption?.length >= 5 &&
                  caption?.length <= 100 &&
                  image !== "" ? (
                    <Button onClick={updatePost}>Update</Button>
                  ) : (
                    <Button disabled>Update</Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
            {/* delete alert dialog stuff here */}
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
      {loadyboi ? <Skeleton width="100%" height="20rem" /> : ""}
      <Image
        src={props?.posts?.image}
        alt=""
        borderRadius="lg"
        onLoad={() => {
          setLoadyboi(false);
        }}
      />
      {loadyboi ? (
        <Skeleton height="1rem" width="24rem" />
      ) : (
        <Heading as="h5" size="sm">
          {props?.posts?.caption}
        </Heading>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap="1.3rem">
          <Flex alignItems="center" gap="0.4rem">
            <IconButton aria-label="Like" isRound={true} onClick={likePost}>
              {loadyboi ? (
                <SkeletonCircle />
              ) : liked ? (
                <BsHeartFill size="1.5rem" cursor="pointer" />
              ) : (
                <BsHeart size="1.5rem" cursor="pointer" />
              )}
            </IconButton>
            <Heading as="h5" size="sm" color="gray.600">
              {likes?.length}
            </Heading>
          </Flex>
          <Flex alignItems="center" gap="0.4rem">
            <IconButton
              aria-label="Comment"
              isRound={true}
              onClick={onCommentOpen}
            >
              {loadyboi ? (
                <SkeletonCircle />
              ) : (
                <BiCommentDetail size="1.5rem" cursor="pointer" />
              )}
            </IconButton>
            <Heading as="h5" size="sm" color="gray.600">
              {comments?.length}
            </Heading>
          </Flex>
          <Flex alignItems="center" gap="0.4rem">
            <IconButton
              aria-label="Comment"
              isRound={true}
              onClick={onReportOpen}
            >
              {loadyboi ? (
                <SkeletonCircle />
              ) : (
                <MdOutlineReportProblem size="1.5rem" cursor="pointer" />
              )}
            </IconButton>
          </Flex>
          <Modal isOpen={isReportOpen} onClose={onReportClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Report Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex flexDirection="column" gap="1rem">
                  <Radio colorScheme="red" value="1">
                    NSFW
                  </Radio>
                  <Radio colorScheme="green" value="2" defaultChecked disabled>
                    Shit post
                  </Radio>
                  <Radio colorScheme="red" value="1">
                    Who are you ?
                  </Radio>
                  <Radio colorScheme="red" value="1">
                    Muck
                  </Radio>
                  <Radio colorScheme="red" value="1">
                    Listen idk what i am doing with my lyfe help
                  </Radio>
                  <Radio colorScheme="red" value="1">
                    Wait what ?
                  </Radio>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button mr={3} onClick={onReportClose}>
                  Close
                </Button>
                <Button onClick={reportPost}>Report</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        <IconButton aria-label="Comment" isRound={true} onClick={savePost}>
          {loadyboi ? (
            <SkeletonCircle />
          ) : saved ? (
            <BsBookmarkFill size="1.5rem" cursor="pointer" />
          ) : (
            <BsBookmark size="1.5rem" cursor="pointer" />
          )}
        </IconButton>
      </Flex>
      {loadyboi ? (
        <Skeleton height="1rem" width="16rem" />
      ) : (
        <Heading
          onClick={onCommentOpen}
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
      )}
      {/* comment modal open here */}
      <Drawer
        isOpen={isCommentOpen}
        placement="right"
        onClose={onCommentClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Comments</DrawerHeader>
          <DrawerBody>
            {comments?.map((comment) => (
              <Flex
                width="100%"
                gap="0.6rem"
                cursor="pointer"
                _hover={{
                  backgroundColor:
                    colorMode === "light" ? "#efefef" : "#20242a",
                }}
                padding="1rem"
              >
                <Avatar src={comment?.userPfp} />
                <Flex flexDirection="column" gap="0.6rem" alignItems="start">
                  <Heading as="h5" size="md">
                    {comment?.userName}
                  </Heading>
                  <Heading as="h5" size="sm" color="gray.600">
                    {comment?.comment}
                  </Heading>
                </Flex>
              </Flex>
            ))}
          </DrawerBody>
          <DrawerFooter gap="1rem" alignItems="center">
            <Avatar />
            <Input
              placeholder="Type here..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setComment(e?.target?.value);
              }}
              value={comment}
            />
            {comment?.length > 0 && comment?.length <= 100 ? (
              <Button onClick={commentBoi}>Send</Button>
            ) : (
              <Button disabled isLoading={commentLoading}>
                Send
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Post;
