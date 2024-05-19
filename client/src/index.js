import React from "react";
import TournamentDashboardContainer from "./pages/TournamentDashboardContainer";
import NewTournamentForm from "./pages/NewTournamentForm";
import * as ReactDOM from "react-dom";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { TournamentProvider } from "./TournamentContextProvider";
import LoginForm from "./dashboards/LoginForm";
import MyTournaments from "./pages/MyTournaments";
import LandingPage from './pages/LandingPage';
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
    {
        path:"/",
        element: <LandingPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path: "/tournament/new",
        element: <NewTournamentForm/>
    },
    {
        path: "/tournament/:id",
        element: <TournamentProvider>
                <TournamentDashboardContainer/>
            </TournamentProvider>,
    },
    {
        path: "/login",
        element: <LoginForm/>
    },
    {
        path: "/tournaments",
        element: <MyTournaments/>
    }
])
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<RouterProvider router={router}/>)