import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useAuth } from "../../AuthContext";
import { useSnackbar } from "../../SnackbarProvider";
import { api } from "../lib/api";
import { useEffect, useMemo, useState } from "react";
import type { DragEvent, MouseEvent } from "react";
import { Task } from "../types/task";
import TaskItem, { updateTaskPayload } from "../components/TaskItem";
import AddIcon from "@mui/icons-material/Add";
import AddTaskForm, { AddTaskPayload } from "../components/AddTaskForm";
import { ApiError } from "../types/api";
import { UNEXPECTED_ERROR_MESSAGE } from "../lib/errorMessage";

type TaskOrder = "manual" | "date" | "created" | "deadline";

const getTaskTime = (task: Task, order: Exclude<TaskOrder, "manual">) => {
  let value: string | undefined;

  switch (order) {
    case "date":
      value = task.startdate;
      break;
    case "created":
      value = task.created_at;
      break;
    case "deadline":
      value = task.deadline;
      break;
  }

  if (!value) return Number.POSITIVE_INFINITY;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

const TasksDashboard = () => {
  type LogoutResponse = { ok: Boolean };
  const { showSnackbar } = useSnackbar();
  const { setUser, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskOrder, setTaskOrder] = useState<TaskOrder>("manual");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);
  const [dropTargetTaskId, setDropTargetTaskId] = useState<string | null>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [isAdding, setisAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const LEFT_W = 320;
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleClick = async () => {
    try {
      await api<LogoutResponse>("/api/auth/logout", { method: "POST" });
      handleUserMenuClose();
      setUser(null);
    } catch {
      showSnackbar(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api<{ tasks: Task[] }>("/api/tasks", {
          method: "GET",
        });
        setTasks(res.tasks);
      } catch (e) {
        if (e instanceof ApiError) {
          showSnackbar(e.message);
        } else {
          showSnackbar(UNEXPECTED_ERROR_MESSAGE);
        }
      }
    };

    fetchTasks();
  }, [showSnackbar]);

  const updateIsAdding = () => {
    setisAdding((prev) => !prev);
  };
  const handleCreateTask = async (payload: AddTaskPayload) => {
    // api call
    try {
      const { task } = await api<{ task: Task }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ ...payload }),
      });
      // if successful, add task to list
      setTasks((prev) => [...prev, task]);
    } catch (e) {
      if (e instanceof ApiError) {
        showSnackbar(e.message);
      } else showSnackbar(UNEXPECTED_ERROR_MESSAGE);
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      await api<{ task: Pick<Task, "id"> }>(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e) {
      if (e instanceof ApiError) {
        showSnackbar(e.message);
      } else showSnackbar(UNEXPECTED_ERROR_MESSAGE);
    }
  };
  const handleUpdateTask = async (payload: updateTaskPayload) => {
    try {
      const { task: updatedTask } = await api<{ task: Task }>(
        `/api/tasks/${payload.task_id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            startdate: payload.startdate,
            deadline: payload.deadline,
            title: payload.title,
          }),
        },
      );
      setTasks((prev) =>
        prev.map((task) => (task.id == updatedTask.id ? updatedTask : task)),
      );
    } catch (e) {
      if (e instanceof ApiError) {
        showSnackbar(e.message);
      } else showSnackbar(UNEXPECTED_ERROR_MESSAGE);
      throw e;
    }
  };

  const persistManualOrder = async (orderedTaskIds: string[]) => {
    try {
      await api<{ ok: boolean }>("/api/tasks/reorder", {
        method: "PATCH",
        body: JSON.stringify({ taskIds: orderedTaskIds }),
      });
    } catch (e) {
      if (e instanceof ApiError) {
        showSnackbar(e.message);
      } else {
        showSnackbar(UNEXPECTED_ERROR_MESSAGE);
      }
    }
  };

  const visibleTasks = useMemo(() => {
    if (taskOrder === "manual") return tasks;

    return [...tasks].sort((a, b) => {
      const diff = getTaskTime(a, taskOrder) - getTaskTime(b, taskOrder);
      return diff || tasks.indexOf(a) - tasks.indexOf(b);
    });
  }, [taskOrder, tasks]);

  const handleTaskOrderChange = (
    _event: MouseEvent<HTMLElement>,
    nextOrder: TaskOrder | null,
  ) => {
    if (nextOrder) setTaskOrder(nextOrder);
  };

  const resetDragState = () => {
    setDraggedTaskId(null);
    setDraggedTaskIndex(null);
    setDropTargetTaskId(null);
  };

  const handleDragStart =
    (taskId: string) => (event: DragEvent<HTMLDivElement>) => {
      if (taskOrder !== "manual") return;

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", taskId);
      setDraggedTaskId(taskId);
      setDraggedTaskIndex(tasks.findIndex((task) => task.id === taskId));
      setDropTargetTaskId(taskId);
    };

  const handleDragOver =
    (taskId: string) => (event: DragEvent<HTMLDivElement>) => {
      if (taskOrder !== "manual" || draggedTaskId === null) return;

      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDropTargetTaskId(taskId);
    };

  const handleDrop = (taskId: string) => (event: DragEvent<HTMLDivElement>) => {
    if (taskOrder !== "manual") return;

    event.preventDefault();

    const sourceTaskId =
      draggedTaskId ?? event.dataTransfer.getData("text/plain");
    if (!sourceTaskId || sourceTaskId === taskId) {
      resetDragState();
      return;
    }

    let nextOrder: string[] = [];

    setTasks((prev) => {
      const sourceIndex = prev.findIndex((task) => task.id === sourceTaskId);
      const targetIndex = prev.findIndex((task) => task.id === taskId);

      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [movedTask] = next.splice(sourceIndex, 1);
      const insertionIndex = sourceIndex < targetIndex ? targetIndex : targetIndex + 1;

      next.splice(insertionIndex, 0, movedTask);
      nextOrder = next.map((task) => task.id);
      return next;
    });

    resetDragState();

    if (nextOrder.length > 0) {
      void persistManualOrder(nextOrder);
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
          <Button
            sx={{ fontWeight: 700, color: "black" }}
            onClick={handleUserMenuOpen}
          >
            {user.name}
          </Button>
          <Menu
            anchorEl={userMenuAnchorEl}
            open={isUserMenuOpen}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.5,
                  minWidth: 140,
                },
              },
            }}
          >
            <MenuItem onClick={handleClick}>Logout</MenuItem>
          </Menu>
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              gap={1}
              sx={{ mt: 2, mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                Sort tasks {taskOrder === "manual" ? "and drag to reorder" : ""}
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={taskOrder}
                onChange={handleTaskOrderChange}
                aria-label="Task sort order"
                sx={{
                  flexWrap: "wrap",
                  "& .MuiToggleButton-root": {
                    px: 1.5,
                    color: "text.secondary",
                    borderColor: "grey.300",
                  },
                  "& .Mui-selected": {
                    color: "primary.main",
                    bgcolor: "rgba(211, 47, 47, 0.08)",
                  },
                }}
              >
                <ToggleButton value="manual" aria-label="Manual order">
                  Manual
                </ToggleButton>
                <ToggleButton value="date" aria-label="Date order">
                  Date
                </ToggleButton>
                <ToggleButton value="created" aria-label="Created date order">
                  Created
                </ToggleButton>
                <ToggleButton value="deadline" aria-label="Deadline order">
                  Deadline
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {visibleTasks.map((task) => (
              <Box
                key={task.id}
                draggable={taskOrder === "manual"}
                onDragStart={handleDragStart(task.id)}
                onDragOver={handleDragOver(task.id)}
                onDrop={handleDrop(task.id)}
                onDragEnd={resetDragState}
                sx={{
                  cursor: taskOrder === "manual" ? "grab" : "default",
                  opacity: draggedTaskId === task.id ? 0.45 : 1,
                  borderBottom:
                    taskOrder === "manual" &&
                    dropTargetTaskId === task.id &&
                    draggedTaskIndex !== null
                      ? "2px solid"
                      : "2px solid transparent",
                  borderColor:
                    taskOrder === "manual" && dropTargetTaskId === task.id
                      ? "primary.main"
                      : "transparent",
                  transition: "opacity 120ms ease, border-color 120ms ease",
                }}
              >
                <TaskItem
                  task={task}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                />
              </Box>
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
    </>
  );
};

export default TasksDashboard;
