import Dashboard from "./components/auth/dashboard";
import Message from "./components/auth/message";
import Onboarding from "./components/auth/onboarding";
import Discovery from "./components/auth/discovery";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./context/authContext"; 
import { useRoutes } from "react-router-dom";

import { BrowserRouter} from "react-router-dom";
import Mentormentee from "./components/auth/currentMentorMentees";

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
      path: "/home",
      element: <Home />,
    },
    {
      path: "/message",
      element: <Message />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/onboarding",
      element: <Onboarding />,
    },
    {
      path: "/discovery",
      element: <Discovery />,
    },
    {
      path: "/currentMentorMentees",
      element: <Mentormentee />,
    }
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
