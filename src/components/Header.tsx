"use client";

import {
  Box,
  Flex,
  Image,
  HStack,
  Text,
  Stack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/"},
];

export default function Header() {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="lg"
      width="100%"
      px={{ base: "5" }}
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW={{ base: "100%", md: "6xl" }}
        mx="auto"
      >
        <IconButton
          size="md"
          icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
          aria-label="Open Menu"
          display={["inherit", "inherit", "none"]}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack alignItems="center">
          <Link href={"/"}>
            <HStack spacing={2} alignItems="center" mr={5}>
              <Image w="8" src={"/logo.png"} mr={1} alt="logo" />
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={useColorModeValue("gray.700", "gray.100")}
              >
                Todo List
              </Text>
            </HStack>
          </Link>
          <HStack
            spacing={1}
            display={{ base: "none", md: "flex" }}
            alignItems="center"
          >
            {navLinks.map((link, index) => (
              <NavLink key={index} {...link} onClose={onClose} />
            ))}
          </HStack>
        </HStack>

        {/* Logout */}
        <Box>
          <IconButton
            aria-label="darkmode"
            onClick={toggleColorMode}
            me={3}
            bg={"none"}
          >
            {colorMode === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
          </IconButton>

          <IconButton
            aria-label="darkmode"
            onClick={handleLogout}
            fontSize={"xl"}
            bg={"none"}
          >
            <IoLogOut />
          </IconButton>
        </Box>
      </Flex>

      {/* Mobile Screen Links */}
      {isOpen ? (
        <Box pb={4} display={["inherit", "inherit", "none"]}>
          <Stack spacing={2}>
            {navLinks.map((link, index) => (
              <NavLink key={index} {...link} onClose={onClose} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

interface NavLinkProps {
  name: string;
  path: string;
  onClose: () => void;
}

const NavLink = ({ name, path, onClose }: NavLinkProps) => {
  const link = {
    bg: useColorModeValue("gray.200", "gray.700"),
    color: useColorModeValue("blue.500", "blue.200"),
  };

  return (
    <Link href={path}>
      <Text
        px={3}
        py={1}
        rounded="md"
        _hover={{ bg: link.bg, color: link.color }}
        cursor="pointer"
        onClick={onClose}
      >
        {name}
      </Text>
    </Link>
  );
};
