import { Card, Text, Button, useColorModeValue } from "@chakra-ui/react";

export const NoTask = () => {
	return (
    <Card p={5} borderRadius={10} boxShadow="md">
      <Text fontSize="lg" fontWeight="bold">
        📝 Create a new task
      </Text>

      <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
        There are no tasks available, create a new task now!
      </Text>
    </Card>
  );
}