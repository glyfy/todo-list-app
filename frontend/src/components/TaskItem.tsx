import { Stack, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Task } from "../types/task";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SportsScoreIcon from "@mui/icons-material/SportsScore";

type TaskItemProps = {
  task: Task;
};

export default function TaskItem({ task }: TaskItemProps) {
  console.log(task);
  return (
    <>
      <Stack
        sx={{ borderBottom: 1, borderColor: "#d6d5d2" }}
        direction="row"
        minHeight="78px"
        alignItems="start"
      >
        <IconButton aria-label="Mark task as complete" size="small">
          <CircleOutlinedIcon />
        </IconButton>
        <Stack mt={0.75} gap={1}>
          <Typography sx={{ color: "black" }}>{task.title}</Typography>
          <Stack direction="row" gap={2}>
            <Stack direction="row" alignItems="center">
              <CalendarTodayIcon sx={{ color: "black" }} />
              <Typography sx={{ color: "black" }} variant="body2">
                {task.startDate?.toLocaleDateString?.()}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <SportsScoreIcon sx={{ color: "black" }} />
              <Typography sx={{ color: "black" }} variant="body2">
                {task.deadline?.toLocaleDateString?.()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
