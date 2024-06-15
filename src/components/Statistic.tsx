import { Box, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface StatisticProps {
	title: string;
	total: number;
	desc: string;
	color: [string, string];
}

const StatisticCard = ({ title, total, desc, color }: StatisticProps) => {
	return (
    <Box
      bg={useColorModeValue(color[0], color[1])}
      color={"white"}
      p={5}
      borderRadius={10}
      textAlign={"center"}
      w={"100%"}
    >
      <Text fontSize="md">{title}</Text>
      <Text fontSize="2xl" fontWeight={"bold"} my={2}>
        {total}
      </Text>
      <Text fontSize="sm">{desc}</Text>
    </Box>
  );
}

export const Statistic = () => {
  const router = useRouter();
  const [taskCount, setTaskCount] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(0);
  const [taskUncompleted, setTaskUncompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tasks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.data.status == 401) {
          router.push("/login");
        }

        setTaskCount(response.data.data.taskCount);
        setTaskCompleted(response.data.data.taskCompleted);
        setTaskUncompleted(response.data.data.taskUncompleted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex dir="row" justifyContent={"space-between"} gap={5}>
      <StatisticCard
        title="Total Task"
        total={taskCount}
        desc="Total task"
        color={["blue.500", "blue.400"]}
      />

      <StatisticCard
        title="Completed Task"
        total={taskCompleted}
        desc="Completed task"
        color={["green.500", "green.400"]}
      />

      <StatisticCard
        title="Uncompleted Task"
        total={taskUncompleted}
        desc="Uncompleted task"
        color={["red.500", "red.400"]}
      />
    </Flex>
  )
};