import { Button, Divider, Stack, TextField } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRef, useState } from "react";
import dayjs from "dayjs";

type AddTaskFormProps = {
  onCancel: () => void;
  onSubmit: (payload: AddTaskPayload) => void;
  submitting?: boolean;
};

export type AddTaskPayload = {
  title: string;
  startDate: Date;
  deadline: Date;
};

export default function AddTaskForm({
  onCancel,
  onSubmit,
  submitting,
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [deadline, setDeadline] = useState(null);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [deadlinePickerOpen, setDeadlinePickerOpen] = useState(false);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const deadlineBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleSubmit = () => {
    onSubmit({
      title: title.trim(),
      startDate: startDate.toDate(),
      deadline: deadline?.toDate() ?? new Date(),
    });
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
        />
        <Stack direction="row" gap={1}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CalendarTodayIcon />}
            onClick={() => setStartDatePickerOpen(true)}
            ref={startBtnRef}
          >
            {startDate ? startDate.format("MMM D YYYY") : "Start Date"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SportsScoreIcon />}
            onClick={() => setDeadlinePickerOpen(true)}
            ref={deadlineBtnRef}
          >
            {deadline ? deadline.format("MMM D YYYY") : "Deadline"}
          </Button>
        </Stack>

        <DatePicker
          label="Start Date"
          open={startDatePickerOpen}
          onClose={() => setStartDatePickerOpen(false)}
          value={startDate}
          onChange={(v) => setStartDate(v)}
          minDate={startDate ?? dayjs()}
          slotProps={{
            popper: {
              anchorEl: startBtnRef.current,
              placement: "bottom-start",
            },
            textField: { sx: { display: "none" } },
          }}
        />
        <DatePicker
          label="Deadline"
          open={deadlinePickerOpen}
          onClose={() => setDeadlinePickerOpen(false)}
          value={deadline}
          onChange={(v) => setDeadline(v)}
          minDate={startDate ?? dayjs()}
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
