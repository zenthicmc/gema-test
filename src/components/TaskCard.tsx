"use client";

import {
  Card,
  Text,
  Button,
  useColorModeValue,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  ModalCloseButton,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { useRef, useState } from "react";
import axios from "axios";
import { formatDate, formatReadableDate } from "@/utils/formatdate";

interface TaskProps {
  id: string;
	title: string;
	desc: string;
	date: [string, string]
	status: string;
}

export const TaskCard = ({ id, title, desc, date, status }: TaskProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

  const color = useColorModeValue("gray.500", "gray.400");
  const textColor = useColorModeValue("white", "gray.900");

	const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();

  const [taskstatus, setStatus] = useState(status);
  const [deleted, setDeleted] = useState(false);

  const [data, setData] = useState({
    title: title,
    description: desc,
    startDate: date[0],
    endDate: date[1],
  });

  const [newData, setNewData] = useState({
    title: title,
    description: desc,
    startDate: date[0],
    endDate: date[1],
  });

	const handleMarkAsDone = async (e: any) => {
    e.preventDefault();

    const response = await axios.post(`/api/tasks/${id}`);
    if(response.data.success) {
      setStatus("completed");
      return toast({
        title: "Completed",
        description: "Your task has been marked as completed.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }

    return toast({
      title: "An error occurred.",
      description: response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
	}

  const handleEdit = async (e: any) => {
    e.preventDefault();

    const response = await axios.put(`/api/tasks/${id}`, data);
    if (response.data.success) {
      setNewData({
        title: response.data.data.title,
        description: response.data.data.description,
        startDate: response.data.data.startDate,
        endDate: response.data.data.endDate,
      });

      onClose();
      return toast({
        title: "Updated",
        description: "Your task has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }

    return toast({
      title: "An error occurred.",
      description: response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

	const handleDelete = async () => {
    const response = await axios.delete(`/api/tasks/${id}`);
    if (response.data.success) {  
      setDeleted(true);
      
      return toast({
        title: "Deleted",
        description: "Your task has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }

    return toast({
      title: "An error occurred.",
      description: response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
	}

  return (
    <>
      {!deleted && (
        <Card p={5} borderRadius={10} boxShadow="md">
          <Flex dir="row" justifyContent={"space-between"} alignItems="center">
            <Box>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold">
                  {newData.title}
                </Text>

                <Badge
                  ml={2}
                  colorScheme={taskstatus === "uncompleted" ? "red" : "green"}
                >
                  {taskstatus}
                </Badge>
              </Flex>

              <Text fontSize="sm" color={color}>
                {newData.description}
              </Text>

              <Text fontSize="xs" color={color} mt={2}>
                {formatReadableDate(newData.startDate)} -{" "}
                {formatReadableDate(newData.endDate)}
              </Text>
            </Box>

            <Box>
              <Button
                onClick={handleMarkAsDone}
                colorScheme="blue"
                size="sm"
                rounded={"full"}
                p={1}
                mr={2}
              >
                <FaCheck />
              </Button>

              <Button
                onClick={onOpen}
                colorScheme="yellow"
                size="sm"
                rounded={"full"}
                p={1}
                mr={2}
                textColor={textColor}
              >
                <MdEdit />
              </Button>

              <Button
                onClick={handleDelete}
                colorScheme="red"
                size="sm"
                rounded={"full"}
                p={1}
              >
                <MdDelete />
              </Button>
            </Box>
          </Flex>
        </Card>
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Existing Task</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEdit}>
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Title"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Description"
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
                  value={formatDate(data.startDate)}
                  onChange={(e) =>
                    setData({ ...data, startDate: e.target.value })
                  }
                />
                <FormHelperText>When will you start this task?</FormHelperText>
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="datetime-local"
                  value={formatDate(data.endDate)}
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
    </>
  );
};
