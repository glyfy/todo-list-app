import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Task } from "../types/task";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { formatTime } from "../lib/dateUtil";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useAuth } from "../../AuthContext";

type TaskItemProps = {
  task: Task;
  onDelete: (task_id: string) => void;
  onUpdate: (task: updateTaskPayload) => Promise<void>;
};
export type updateTaskPayload = {
  task_id: string;
  startdate: string;
  deadline: string;
  title: string;
};
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "short", // "Mar"
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function TaskItem({ task, onDelete, onUpdate }: TaskItemProps) {
  const handleDelete = () => {
    onDelete(task.id);
  };
  const handleEdit = () => {
    setMode("editor");
  };
  const handleSave = async () => {
    try {
      await onUpdate({
        title: title,
        startdate: startdate.toISOString(),
        deadline: deadline,
        task_id: task.id,
      });
      setMode("display");
    } catch {}
  };
  const [mode, setMode] = useState<"display" | "editor">("display");
  const [title, setTitle] = useState(task.title);
  const [startdate, setstartdate] = useState<Dayjs>(dayjs(task.startdate));
  const [deadline, setDeadline] = useState<string | null>(task.deadline);
  const [startdatePickerOpen, setstartdatePickerOpen] = useState(false);
  const [deadlinePickerOpen, setDeadlinePickerOpen] = useState(false);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const deadlineBtnRef = useRef<HTMLButtonElement | null>(null);
  const { user } = useAuth();
  const handleCancel = () => {
    setMode("display");
  };
  return (
    <>
      {mode == "display" && (
        <Stack
          sx={{ borderBottom: 1, borderColor: "#d6d5d2" }}
          direction="row"
          minHeight="78px"
          alignItems="start"
        >
          <IconButton aria-label="Mark task as complete" size="small">
            <CircleOutlinedIcon />
          </IconButton>
          <Stack mt={0.75} gap={1} sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "black" }}>{task.title}</Typography>
              <Box>
                <IconButton onClick={handleEdit} sx={{ p: 0 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} sx={{ p: 0 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" alignItems="center">
                <CalendarTodayIcon sx={{ color: "black" }} />
                <Typography sx={{ color: "black" }} variant="body2">
                  {formatTime(timeFormatter, task.startdate)}
                </Typography>
              </Stack>
              {task.deadline && (
                <Stack direction="row" alignItems="center">
                  <SportsScoreIcon sx={{ color: "black" }} />
                  <Typography sx={{ color: "black" }} variant="body2">
                    {task.deadline && formatTime(timeFormatter, task.deadline)}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
      {mode == "editor" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <Stack sx={{ p: 1 }}>
              <TextField
                placeholder="Task name"
                variant="standard"
                slotProps={{ input: { disableUnderline: true } }}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <Stack direction="row" gap={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CalendarTodayIcon />}
                  onClick={() => setstartdatePickerOpen(true)}
                  ref={startBtnRef}
                >
                  {startdate
                    ? startdate.format("MMM D YYYY, h:mm A")
                    : "Start Date"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<SportsScoreIcon />}
                  onClick={() => setDeadlinePickerOpen(true)}
                  ref={deadlineBtnRef}
                >
                  {deadline
                    ? dayjs(deadline).format("MMM D YYYY, h:mm A")
                    : "Deadline"}
                </Button>
              </Stack>
              <DateTimePicker
                label="Start Date & Time"
                open={startdatePickerOpen}
                onClose={() => setstartdatePickerOpen(false)}
                value={startdate}
                onChange={(v) => {
                  if (v) setstartdate(v);
                }}
                timeSteps={{ minutes: 1 }}
                minDateTime={dayjs()}
                slotProps={{
                  popper: {
                    anchorEl: startBtnRef.current,
                    placement: "bottom-start",
                  },
                  textField: { sx: { display: "none" } },
                }}
              />
              <DateTimePicker
                label="Deadline & Time"
                open={deadlinePickerOpen}
                onClose={() => setDeadlinePickerOpen(false)}
                value={dayjs(deadline)}
                onChange={(v) => setDeadline(v.toISOString())}
                timeSteps={{ minutes: 1 }}
                minDateTime={startdate ?? dayjs()}
                slotProps={{
                  popper: {
                    anchorEl: deadlineBtnRef.current,
                    placement: "bottom-start",
                  },
                  textField: { sx: { display: "none" } },
                }}
              />
              <Stack direction="row" justifyContent="end" gap={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  disabled={title.trim() == ""}
                  onClick={handleSave}
                  sx={{
                    bgcolor: "error.main",
                    color: "common.white",
                    borderColor: "error.main",
                    "&:hover": {
                      bgcolor: "error.dark",
                      borderColor: "error.dark",
                    },
                  }}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>
        </LocalizationProvider>
      )}
    </>
  );
}
