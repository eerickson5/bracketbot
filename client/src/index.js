import React from "react";
import App from "./components/App";
import TournamentDashboard from "./pages/TournamentDashboard";
import NewTournamentForm from "./pages/NewTournamentForm";
import * as ReactDOM from "react-dom";
import "./index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

const router = createBrowserRouter([
    {
        path: "/tournament/new",
        element: <NewTournamentForm/>
    },
    {
        path: "/tournament/:id",
        element: <TournamentDashboard/>
    }
])
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<RouterProvider router={router}/>)