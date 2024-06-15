"use client"

import {
  Container,
  Flex,
  Text,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { NoTask } from "@/components/NoTask";
import { Statistic } from "@/components/Statistic";
import { TaskCard } from "@/components/TaskCard";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface User {
  username: string;
  email: string;
}

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>();
  const [user, setUser] = useState<User>();

  const [data, setData] = useState({
    user_id: 1,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tasks", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
          },
        });

        if(response.data.status == 401) {
          router.push("/login");
        }

        setTasks(response.data.data.tasks);
        setUser(response.data.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [loading]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await axios.post("/api/tasks", data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
    });
    if (response.data.success) {
      // clear form
      setData({
        user_id: 1,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
      });

      toast({
        title: "Task created.",
        description: "Your task has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      onClose();
    } else {
      toast({
        title: "Failed to create task.",
        description: response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <Container maxW="6xl" mt={10}>
        <Text fontSize="2xl" fontWeight="bold">
          Today Tasks
        </Text>
        <Flex dir="row" justifyContent={"space-between"}>
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.500", "gray.400")}
            mb={5}
          >
            👋 Welcome back {user?.username}, here are your tasks for today.
          </Text>

          <Text
            fontSize="sm"
            color={useColorModeValue("gray.500", "gray.400")}
            mb={5}
          >
            {new Date().toDateString()}
          </Text>
        </Flex>

        <Statistic />

        <Flex dir="row" justifyContent={"space-between"} gap={5} mt={14}>
          <Text fontSize="xl" fontWeight="bold">
            Available Tasks
          </Text>

          <Button onClick={onOpen} colorScheme="blue" size="sm" px={5}>
            Add New Task
          </Button>
        </Flex>

        <Flex direction={"column"} gap={4} mt={3} mb={5}>
          {tasks && tasks.length == 0 && <NoTask />}

          {tasks &&
            tasks.map((task: Task, i) => (
              <TaskCard
                key={i}
                id={task._id}
                title={task.title}
                desc={task.description}
                date={[task.startDate, task.endDate]}
                status={task.status}
              />
            ))}
        </Flex>

        {/* Modal Create */}
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody pb={6}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Title"
                    minLength={4}
                    value={data.title}
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    placeholder="Description"
                    minLength={10}
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                  <FormHelperText>Describe your task in detail.</FormHelperText>
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="datetime-local"
                    value={data.startDate}
                    onChange={(e) =>
                      setData({ ...data, startDate: e.target.value })
                    }
                  />
                  <FormHelperText>
                    When will you start this task?
                  </FormHelperText>
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="datetime-local"
                    value={data.endDate}
                    onChange={(e) =>
                      setData({ ...data, endDate: e.target.value })
                    }
                  />
                  <FormHelperText>When will you end this task?</FormHelperText>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}
