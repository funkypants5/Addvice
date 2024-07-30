import Discovery from "./components/discovery/discovery";
import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";
import ViewProfile from "./components/viewProfile";
import ChatApp from "./components/chatroom/chatroom";

import Header from "./components/header/header";
import Profile from "./components/updateProfile";

import { AuthProvider } from "./context/authContext";
import { useRoutes } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";
import Mentormentee from "./components/currentMentorMentees";
import MessagingPage from "./components/chats/messagingpage";
import Mentorship from "./components/Mentorship/Mentorship";
import Calendar from "./components/Calendar/Calendar";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/chatapp",
      element: <ChatApp />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/discovery",
      element: <Discovery />,
    },
    {
      path: "/currentMentorMentees",
      element: <Mentormentee />,
    },
    {
      path: "/viewProfile/:uid",
      element: <ViewProfile />,
    },
    {
      path: "/messagingpage",
      element: <MessagingPage />,
    },
    {
      path: "/Mentorship/:uid",
      element: <Mentorship />,
    },
    {
      path: "/Calendar",
      element: <Calendar />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
