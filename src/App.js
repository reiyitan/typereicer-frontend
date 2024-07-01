import "./App.css"; 
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage, RegisterPage, HomePage } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    }
])

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
