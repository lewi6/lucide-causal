import { useEffect, useState } from "react";
import UsersList from "./components/UsersList";
import { LoginForm } from "./components/auth/login-form";

const App = () => {
  const [showUsersList, setShowUsersList] = useState(false);

  const sessionId = localStorage.getItem("session_id");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    setShowUsersList(true);
  }, [sessionId]);

  return (
    <div className="h-screen w-full p-4">
      {/* <Button onClick={() => setShowUsersList(!showUsersList)}>
        {showUsersList ? "Hide Users List" : "Show Users List"}
      </Button> */}

      {!showUsersList ? <LoginForm /> : <UsersList />}
    </div>
  );
};

export default App;
