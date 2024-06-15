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

export default function Register() {
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await axios.post("/api/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(response.data.success) {
      toast({
        title: "Account created.",
        description: "Your account has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      return router.push("/verify");
    }
    
    toast({
      title: "Error",
      description: response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });

    setLoading(false);
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
          Create an account
        </Text>
        <Text
          fontSize="sm"
          textAlign="center"
          mb={10}
          color={useColorModeValue("gray.600", "gray.400")}
        >
          Please fill in the form to create an account.
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <FormHelperText>This will be your display name.</FormHelperText>
          </FormControl>

          <FormControl id="email" mt={5} isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <FormHelperText>We&apos;ll never share your email.</FormHelperText>
          </FormControl>

          <FormControl id="password" mt={5} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              minLength={8}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </FormControl>

          <FormControl id="confirm_password" mt={5} isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              minLength={8}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
          </FormControl>

          <Button
            isLoading={loading}
            type="submit"
            colorScheme="blue"
            mt={5}
            w="100%"
          >
            Register
          </Button>

          <Text textAlign="center" mt={5}>
            <Link href="/login">Already have an account? Login here</Link>
          </Text>
        </form>
      </Card>
    </>
  );
}
