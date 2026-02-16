import { Box, Button, Fab, Stack, Typography } from "@mui/material";
import { useAuth } from "../../AuthContext";
import { useSnackbar } from "../../SnackbarProvider";
import { api } from "../lib/api";
import { useEffect, useState } from "react";
import { Task } from "../types/task";
import TaskItem from "../components/TaskItem";
import AddIcon from "@mui/icons-material/Add";
import AddTaskForm, { AddTaskPayload } from "../components/AddTaskForm";
import { ApiError } from "../types/api";
import { UNEXPECTED_ERROR_MESSAGE } from "../lib/errorMessage";

let dummyTasks: Task[] = [
  {
    user_id: "1",
    title: "task 1",
    startDate: "2026-03-15T10:30:00",
    deadline: "2026-03-17T10:30:00",
  },
  {
    user_id: "2",
    title: "task 2",
    startDate: "2026-03-15T10:30:00",
    deadline: "2026-03-17T10:30:00",
  },
  {
    user_id: "3",
    title: "task 3",
    startDate: "2026-03-15T10:30:00",
    deadline: "2026-03-17T10:30:00",
  },
];
const TasksDashboard = () => {
  type LogoutResponse = { ok: Boolean };
  const { showSnackbar } = useSnackbar();
  const { setUser, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isAdding, setisAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const LEFT_W = 320;
  const handleClick = async () => {
    try {
      await api<LogoutResponse>("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch {
      showSnackbar(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  useEffect(() => {
    // api call to get tasks
    setTasks(dummyTasks);
  }, []);

  const updateIsAdding = () => {
    setisAdding((prev) => !prev);
  };
  const handleCreateTask = async (payload: AddTaskPayload) => {
    console.log(payload);
    // api call
    try {
      const res = await api<{ task: Task }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ ...payload }),
      });
      const task = res.task;
      // if successful, add task to list
      setTasks((prev) => [...prev, task]);
    } catch (e) {
      if (e instanceof ApiError) {
        showSnackbar(e.message);
      } else showSnackbar(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", minHeight: "100dvh", width: "100%" }}>
        <Box
          sx={{
            width: LEFT_W,
            position: "sticky",
            top: 0,
            height: "100dvh",
            backgroundColor: "#fcfaf8",
          }}
        >
          <Button sx={{ fontWeight: 700, color: "black" }}>{user.name}</Button>
        </Box>

        {/* Main area takes the remaining width */}
        <Box
          sx={{
            flex: 1,
            minHeight: "100dvh",
            display: "flex",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              mx: "auto",
              px: 3,
              py: 3,
            }}
          >
            <Typography
              sx={{ color: "black", fontWeight: 700, fontSize: "26px" }}
            >
              Today
            </Typography>
            {tasks.map((task) => (
              <TaskItem task={task} />
            ))}
            {isAdding ? null : (
              <Button
                variant="text"
                color="primary"
                startIcon={<AddIcon sx={{ color: "primary.main" }} />}
                sx={{ textTransform: "none", mt: 2, color: "text.secondary" }}
                onClick={updateIsAdding}
              >
                Add Task
              </Button>
            )}

            {isAdding && (
              <AddTaskForm
                onCancel={updateIsAdding}
                onSubmit={handleCreateTask}
              />
            )}
          </Box>
        </Box>
      </Box>
      <button onClick={handleClick}>Logout</button>
    </>
  );
};

export default TasksDashboard;
