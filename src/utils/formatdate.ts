export const formatDate = (date: string) => {
	const formattedDate = new Date(date).toISOString().slice(0, 16);

	return formattedDate;
}

export const formatReadableDate = (date: string) => {
	const formattedDate = new Date(date).toLocaleString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	return formattedDate;
}
