import { Stack, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
};

export default function TaskItem({ task }: TaskItemProps) {
  console.log(task);
  return (
    <Stack
      sx={{ borderBottom: 1, borderColor: "#d6d5d2" }}
      direction="row"
      minHeight="78px"
      alignItems="start"
    >
      <IconButton aria-label="Mark task as complete" size="small">
        <CircleOutlinedIcon />
      </IconButton>
      <Stack mt={0.75}>
        <Typography sx={{ color: "black" }}>Test</Typography>
      </Stack>
    </Stack>
  );
}
