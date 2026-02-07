import { useAuth } from "../../AuthContext";
import { useSnackbar } from "../../SnackbarProvider";
import { api } from "../lib/api";

const TasksDashboard = () => {
  type LogoutResponse = { ok: Boolean };
  const { showSnackbar } = useSnackbar();
  const { setUser } = useAuth();
  const handleClick = () => {
    try {
      api<LogoutResponse>("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch {
      showSnackbar("Unexpected error occured. Please try again");
    }
  };
  return (
    <>
      <div>Placeholder for tasks</div>
      <button onClick={handleClick}>Logout</button>;
    </>
  );
};

export default TasksDashboard;
