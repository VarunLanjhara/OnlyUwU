import {
  Avatar,
  Button,
  Divider,
  Flex,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";

const LeftSidebar = () => {
  const { colorMode } = useColorMode();
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
          <Flex justifyContent="space-between">
            <Flex flexDirection="row" gap="0.6rem" alignItems="center">
              <Avatar cursor="pointer" />
              <Heading as="h5" size="sm">
                Varun
              </Heading>
            </Flex>
            <Button colorScheme="purple" variant="solid">
              Follow
            </Button>
          </Flex>
          <Flex justifyContent="space-between">
            <Flex flexDirection="row" gap="0.6rem" alignItems="center">
              <Avatar cursor="pointer" />
              <Heading as="h5" size="sm">
                Varun
              </Heading>
            </Flex>
            <Button colorScheme="purple" variant="solid">
              Follow
            </Button>
          </Flex>
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
          <Flex
            gap="0.4rem"
            _hover={{
              cursor: "pointer",
              backgroundColor: colorMode === "light" ? "#efefef" : "#20242a",
            }}
          >
            <Flex flexDirection="row" gap="0.6rem">
              <Avatar cursor="pointer" />
            </Flex>
            <Flex flexDirection="column" gap="0.4rem">
              <Heading as="h5" size="sm">
                Varun
              </Heading>
              <Heading as="h5" size="xs" color="gray.600">
                I am so dumb help me and eat shit lol
              </Heading>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LeftSidebar;
