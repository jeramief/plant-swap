import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from "./components/Navigation/Navigation-bonus";
import * as sessionActions from "./store/session";
import { Modal } from "./context/Modal";
import Landing from "./components/Landing";
import ListsIndex from "./components/ListsIndex";
import GroupDetails from "./components/GroupDetails/GroupDetails";
import GroupCreate from "./components/GroupCreate/GroupCreate";
import GroupUpdate from "./components/GroupUpdate";
import EventCreate from "./components/EventCreate";
import EventDetails from "./components/EventDetails";

// import CreateGroup from './components/CreateGroup';
// import CreateEvent from './components/CreateEvent';
// import EventShow from './components/EventShow';
// import GroupShow from './components/GroupShow';
// import UpdateGroup from './components/UpdateGroup';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Modal />
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "groups",
        element: <ListsIndex type="group" />,
      },
      {
        path: "groups/new",
        element: <GroupCreate />,
      },
      {
        path: "groups/:groupId",
        element: <GroupDetails />,
      },
      {
        path: "groups/:groupId/edit",
        element: <GroupUpdate />,
      },
      {
        path: "events",
        element: <ListsIndex type="event" />,
      },
      {
        path: "events/:eventId",
        element: <EventDetails type="event" />,
      },
      {
        path: "groups/:groupId/events/new",
        element: <EventCreate />,
      },

      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
