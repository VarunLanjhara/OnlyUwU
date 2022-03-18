import React, { useState } from "react";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  useColorMode,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ImSearch } from "react-icons/im";
import { FaSun, FaMoon, FaUser } from "react-icons/fa";
import { AiOutlineFire } from "react-icons/ai";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";

const LoginNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const login = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setLoading(false);
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
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={4}
      position="sticky"
      top={0}
      zIndex="100"
      backgroundColor={colorMode === "light" ? "#ffffff" : "#1a202c"}
    >
      <Flex>
        <Heading
          color={colorMode === "light" ? "black" : "white"}
          size="xl"
          fontFamily="Sansita Swashed"
        >
          OnlyUwU
        </Heading>
      </Flex>
      <Tooltip label="Search shit" openDelay={400}>
        <InputGroup mx={8} width="50vw">
          <InputLeftElement
            pointerEvents="none"
            children={<ImSearch color="gray.300" />}
          />
          <Input type="text" placeholder="Search shit ..." variant="filled" />
        </InputGroup>
      </Tooltip>
      {colorMode === "light" ? (
        <Tooltip label="Dark mode" openDelay={400}>
          <IconButton
            icon={<FaMoon />}
            aria-label="Dark mode"
            onClick={() => {
              toggleColorMode();
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip label="Light mode" openDelay={400}>
          <IconButton
            icon={<FaSun />}
            aria-label="Light mode"
            onClick={() => {
              toggleColorMode();
            }}
          />
        </Tooltip>
      )}
      <Tooltip label="Get started" openDelay={400}>
        <Button
          isLoading={loading}
          leftIcon={<AiOutlineFire />}
          colorScheme="purple"
          variant="solid"
          borderRadius={24}
          padding={6}
          onClick={login}
        >
          Get started
        </Button>
      </Tooltip>
    </Flex>
  );
};

export default LoginNavbar;
