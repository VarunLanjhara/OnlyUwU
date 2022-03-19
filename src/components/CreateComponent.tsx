import React, { useState } from "react";
import {
  Flex,
  Heading,
  Image,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { BsImageFill } from "react-icons/bs";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const CreateComponent = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setImageUrl(URL.createObjectURL(e?.target?.files[0]));
    //@ts-ignore
    setImage(e?.target?.files[0]);
  };
  const toast = useToast();
  const storage = getStorage(app);
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);
  const createPost = async () => {
    setLoading(true);
    //@ts-ignore
    const storageRef = ref(storage, `/images/${image.name + Date.now()}`);
    const auth = getAuth(app);
    //@ts-ignore
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        setLoading(false);
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
            await addDoc(collection(db, "posts"), {
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
                  description: "Post created succesfully",
                  status: "success",
                  duration: 6900,
                  isClosable: true,
                });
                setLoading(false);
                navigate("/");
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
  };
  return (
    <Flex flexDirection="column" gap="2rem" width="100%" height="max-content">
      <Heading as="h4" size="md">
        ** Both image and caption are required and you have to complete the
        validation to create a post so dont be an asshole and no need to dm me
        on discord that its not working **
      </Heading>
      <Flex flexDirection="column" gap="0.4rem" width="100%">
        <Input
          variant="filled"
          placeholder="Caption"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCaption(e.target.value);
          }}
          value={caption}
        />
        {caption.length >= 5 && caption.length <= 100 ? (
          ""
        ) : (
          <Heading as="h4" size="sm" color="gray.500">
            Caption must be between 5 to 100 letters
          </Heading>
        )}
      </Flex>
      <Flex flexDirection="column" gap="0.4rem" width="100%">
        <input
          type="file"
          accept="image/*"
          placeholder="Select post image"
          onChange={uploadImage}
        />
        {imageUrl !== "" ? (
          <Image src={imageUrl} alt="" width="100%" />
        ) : (
          <>
            <Flex alignItems="center" gap="1rem">
              <BsImageFill size="50%" />
              <Heading as="h4" size="md">
                Select image idiot
              </Heading>
            </Flex>
            <Heading as="h4" size="sm" color="gray.500">
              Image is required
            </Heading>
          </>
        )}
      </Flex>
      {caption.length >= 5 && caption.length <= 100 && imageUrl !== "" ? (
        <Button
          colorScheme="purple"
          marginBottom="1rem"
          onClick={createPost}
          isLoading={loading}
          loadingText="Creating"
        >
          Create post
        </Button>
      ) : (
        <Button colorScheme="purple" marginBottom="1rem" disabled>
          Create post
        </Button>
      )}
    </Flex>
  );
};

export default CreateComponent;
