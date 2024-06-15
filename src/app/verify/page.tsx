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

export default function Verify() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await axios.post("/api/auth/verify", {
      verificationCode
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    if(response.data.success) {
      toast({
        title: "Account verified.",
        description: "Your account has been verified successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      return router.push("/login");
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
          Verify your account
        </Text>
        <Text
          fontSize="sm"
          textAlign="center"
          mb={10}
          color={useColorModeValue("gray.600", "gray.400")}
        >
          Please enter the verification code sent to your email.
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl id="verification_code" isRequired>
            <FormLabel>Verification code</FormLabel>
            <Input
              type="number"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <FormHelperText>
              Not received the code? please wait for a moment or check your spam
              folder.
            </FormHelperText>
          </FormControl>

          <Button
            isLoading={loading}
            type="submit"
            colorScheme="blue"
            mt={5}
            w="100%"
          >
            Verify
          </Button>

          <Text textAlign="center" mt={5}>
            <Link href="/register">Used wrong email? retry registration</Link>
          </Text>
        </form>
      </Card>
    </>
  );
}
