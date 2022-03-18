import React, { useState, useEffect } from "react";
import LoginNavbar from "../components/LoginNavbar";
import {
  Button,
  Flex,
  Heading,
  Image,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineFire } from "react-icons/ai";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const Login = () => {
  useEffect(() => {
    document.title = "OnlyUwU - Login";
  }, []);
  const toast = useToast();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore(app);
  const login = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await setDoc(doc(db, "users", result?.user?.uid), {
          username: result?.user?.displayName,
          bio: "I love OnlyUwU",
          uid: result?.user?.uid,
          pfp: result?.user?.photoURL,
          email: result?.user?.email,
        })
          .then(() => {
            setLoading(false);
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
  };
  return (
    <Flex overflow="hidden" flexDirection="column" height="100vh" width="100vw">
      <LoginNavbar />
      <Flex
        justifyContent="center"
        alignItems="center"
        width="100vw"
        height="73vh"
        overflow="hidden"
      >
        <Flex flexDirection="column" gap="1.4rem">
          <Flex flexDirection="column" alignItems="center">
            <Heading as="h4" size="xl">
              Make friends with
            </Heading>
            <Heading as="h4" size="xl">
              OnlyUwU
            </Heading>
          </Flex>
          <Tooltip label="Get started" openDelay={400}>
            <Button
              isLoading={loading}
              leftIcon={<AiOutlineFire />}
              colorScheme="purple"
              variant="solid"
              borderRadius={24}
              size="lg"
              onClick={login}
            >
              Get started
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
