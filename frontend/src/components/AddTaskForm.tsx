import { Button, Divider, Stack, TextField } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useAuth } from "../../AuthContext";

type AddTaskFormProps = {
  onCancel: () => void;
  onSubmit: (payload: AddTaskPayload) => void;
  submitting?: boolean;
};

export type AddTaskPayload = {
  title: string;
  startdate: string;
  deadline?: string | null;
  user_id: string;
};

export type DeleteTaskPayload = {
  id: string;
  user_id: string;
};

export default function AddTaskForm({
  onCancel,
  onSubmit,
  submitting,
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [startdate, setstartdate] = useState<Dayjs>(dayjs());
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [startdatePickerOpen, setstartdatePickerOpen] = useState(false);
  const [deadlinePickerOpen, setDeadlinePickerOpen] = useState(false);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const deadlineBtnRef = useRef<HTMLButtonElement | null>(null);
  const { user } = useAuth();

  const handleSubmit = () => {
    onSubmit({
      title: title.trim(),
      startdate: startdate.toISOString(),
      deadline: deadline ? deadline?.toISOString() : null,
      user_id: user.id,
    });
    setTitle("");
    setstartdate(dayjs());
    setDeadline(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        sx={{
          border: "1px solid",
          borderColor: "grey.500",
          borderRadius: 2,
          p: 1,
        }}
      >
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
            {startdate ? startdate.format("MMM D YYYY, h:mm A") : "Start Date"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SportsScoreIcon />}
            onClick={() => setDeadlinePickerOpen(true)}
            ref={deadlineBtnRef}
          >
            {deadline ? deadline.format("MMM D YYYY, h:mm A") : "Deadline"}
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
          value={deadline}
          onChange={(v) => setDeadline(v)}
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
        <Divider sx={{ mt: 1, mb: 1 }} />

        <Stack direction="row" justifyContent="end" gap={1}>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            disabled={title.trim() == ""}
            onClick={handleSubmit}
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
            Add task
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
