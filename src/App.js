import Discovery from "./components/discovery/discovery";
import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";
import ViewProfile from "./components/auth/viewProfile";

import Header from "./components/header/header";
import Profile from "./components/updateProfile";

import { AuthProvider } from "./context/authContext"; 
import { useRoutes } from "react-router-dom";

import { BrowserRouter} from "react-router-dom";
import Mentormentee from "./components/auth/currentMentorMentees";
import MessagingPage from "./components/chats/messagingpage";

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
      path: "/viewProfile/:name",
      element: <ViewProfile />,
    },
    {
      path: "/messagingpage",
      element: <MessagingPage />,
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
