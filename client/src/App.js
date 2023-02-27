import logo from "./logo.svg";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import MainBlog from "./pages/MainBlog";
// import MyBlog from "./pages/MyBlog";
import Navbar from "./utils/Navbar";
import StateProvider from "./context/Hooks/StateProvider";
import FunctionProvider from "./context/Function/FunctionProvider";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

function App() {
  return (
    <>
      <>
        <BrowserRouter>
          <StateProvider>
            <FunctionProvider>
              <Navbar />
              <ToastContainer />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* <Route path="/allblogs" element={<MainBlog />} />
            <Route path="/myblog" element={<MyBlog />} /> */}
              </Routes>
            </FunctionProvider>
          </StateProvider>
        </BrowserRouter>
      </>
    </>
  );
}

export default App;