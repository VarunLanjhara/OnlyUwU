import { Flex, Image } from "@chakra-ui/react";
import React, { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    document.title = "OnlyUwU - Loading";
  }, []);
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      background="white"
    >
      <Image src="/loader.gif" height="50%" width="50%" objectFit="cover" />
    </Flex>
  );
};

export default Loader;
