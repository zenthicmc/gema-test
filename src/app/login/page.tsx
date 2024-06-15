"use client";

import {
  Card,
  Text,
  FormControl,
  FormLabel,
  useColorModeValue,
  FormHelperText,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const response = await axios.post("/api/auth/login", {
      email,
      password,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    if(response.data.success) {
      toast({
        title: "Logged in successfully.",
        description: "You have been logged in successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      localStorage.setItem("token", response.data.data.token);

      return router.push("/");
    }

    toast({
      title: "Error",
      description: response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }
	return (
    <>
      <Card w={"md"} p={10} m="auto" mt={20} rounded={"xl"} shadow={"lg"}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={70}
          height={70}
          style={{ margin: "0 auto" }}
        />

        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={5}>
          Welcome back!
        </Text>
        <Text
          fontSize="sm"
          textAlign="center"
          mb={10}
          color={useColorModeValue("gray.600", "gray.400")}
        >
          Please login using your credentials to continue.
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormHelperText>We&apos;ll never share your email.</FormHelperText>
          </FormControl>

          <FormControl id="password" mt={5} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            isLoading={loading}
            type="submit"
            colorScheme="blue"
            mt={5}
            w="100%"
          >
            Login
          </Button>
          <Text textAlign="center" mt={5}>
            <Link href="/register">
              Don&apos;t have an account? Register here
            </Link>
          </Text>
        </form>
      </Card>
    </>
  );
}
