import { useEffect } from "react";
// import Authprovider from "./context/Authcontext";
import { router } from "./routes/Index";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./pages/confic";
import { useDispatch } from "react-redux";
import { initial, login, logout } from "./store/slices/slice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch(initial());
      if (user) {
        dispatch(login({ email: user.email, uid: user.uid }));
      } else {
        dispatch(logout());
      }
    });
  }, []);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
