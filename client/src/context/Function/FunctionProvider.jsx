import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../Hooks/StateContext";
import FunctionContext from "./FunctionContext";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const FunctionProvider = ({ children }) => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    currentUser,
    setCurrentUser,
    setIsLogin,
    setItems,
    setIsLoading,
    setItem,
    setComments,
    makeComment,
    setMakeComment,
    setAllComments,
    select,
    setSelect,
    blog,
    setBlog,
    setGetLoginBlog,
    search,
    item,
    setSearch,
  } = useContext(StateContext);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const token = localStorage.getItem("user");
      const decode = jwt_decode(token);
      const { id } = decode;

      setCurrentUser({
        name: id.name,
        email: id.email,
        pic: id.pic,
        id: id._id,
      });

      setIsLogin(true);
    }
  }, [localStorage.getItem("user")]);

  const toastOption = {
    position: "bottom-right",
    autoClose: 6000,
    pauseOnHover: true,
    draggable: true,
  };

  const handleUser = (e) => {
    const { name, value } = e.target;
    setUser(() => {
      return {
        ...user,
        [name]: value,
      };
    });
  };

  const handleBlog = (e) => {
    const { name, value } = e.target;
    setBlog(() => {
      return {
        ...blog,
        [name]: value,
      };
    });
  };

  const handlePic = (e) => {
    setUser({ ...user, pic: e.target.files[0] });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    setSelect(e.target.value);
  };

  const RegisterUser = async () => {
    try {
      const formdata = new FormData();
      formdata.append("name", user.name);
      formdata.append("email", user.email);
      formdata.append("password", user.password);
      formdata.append("myFile", user.pic);
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/registeruser",
        formdata
      );

      if (!data.status) {
        toast.error(data.msg, toastOption);
        return false;
      }
      if (data.status) {
        toast.success(data.msg, toastOption);
        localStorage.setItem("user", data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const LoginUser = async () => {
    try {
      const { email, password } = user;
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/loginUser",
        { email, password }
      );

      if (!data.status) {
        toast.error(data.msg, toastOption);
        return false;
      }
      if (data.status) {
        toast.success(data.msg, toastOption);
        localStorage.setItem("user", data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = () => {
    localStorage.clear();
    toast.success("Log out successfully", toastOption);
    setIsLogin(false);
    navigate("/");
  };

  const getBlogs = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/blog/getAllBlogs"
      );

      setItems(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, [window.location.pathname]);

  const getBlog = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/blog/getBlog/${id}`
      );
      setItem(data);

      setBlog({
        title: data.title,
        desc: data.desc,
        pic: data.blogPic,
      });
      // setSelect(data.category);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/blog/getcomment/${id}`
      );
      setComments(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComments = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/blog/getAllComment/${id}`
      );
      setAllComments(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (e) => {
    setMakeComment(e.target.value);
  };

  const createComment = async (id) => {
    try {
      if (!localStorage.getItem("user")) {
        navigate("/login");
        return false;
      }
      const { data } = await axios.post(
        `http://localhost:5000/api/blog/comment/${id}`,

        { comment: makeComment, author: currentUser._id, to: id },
        {
          headers: {
            Authorization: localStorage.getItem("user"),
          },
        }
      );
      if (!data.status) {
        toast.error(data.msg, toastOption);
        return false;
      }

      if (data.status) {
        toast.success(data.msg, toastOption);
        setMakeComment("");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createBlog = async () => {
    try {
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const nowdate = new Date();
      const date =
        month[nowdate.getMonth()] +
        " " +
        nowdate.getDate() +
        ", " +
        nowdate.getFullYear();

      const { title, desc, pic } = blog;
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("desc", desc);
      formdata.append("category", select);
      formdata.append("userId", currentUser.id);
      formdata.append("name", currentUser.name);
      formdata.append("userPic", currentUser.pic);
      formdata.append("date", date);
      formdata.append("blogFile", user.pic);
      const { data } = await axios.post(
        "http://localhost:5000/api/blog/createBlog",
        formdata,
        {
          headers: {
            Authorization: localStorage.getItem("user"),
          },
        }
      );

      if (!data.status) {
        toast.error(data.msg, toastOption);
        return false;
      }

      if (data.status) {
        toast.success(data.msg, toastOption);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const currentUserBlog = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/blog/getCurrentUserBlog",
        {
          headers: {
            Authorization: localStorage.getItem("user"),
          },
        }
      );
      setGetLoginBlog(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id) => {
    const { data } = await axios.delete(
      `http://localhost:5000/api/blog/deleteBlog/${id}`,
      {
        headers: {
          Authorization: localStorage.getItem("user"),
        },
      }
    );

    if (!data.status) {
      toast.error(data.msg, toastOption);
    }

    if (data.status) {
      toast.success(data.msg, toastOption);
      navigate("/myprofile");
    }
  };

  const editBlog = async (id) => {
    try {
      const { title, desc } = blog;
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("desc", desc);
      formdata.append("category", select === "" ? item.category : select);

      const { data } = await axios.put(
        `http://localhost:5000/api/blog/editBlog/${id}`,
        formdata,
        {
          headers: {
            Authorization: localStorage.getItem("user"),
          },
        }
      );

      if (formdata.select === "") {
        toast.error(data.msg, toastOption);
        return false;
      }

      if (!data.status) {
        toast.error(data.msg, toastOption);
        return false;
      }

      if (data.status) {
        toast.success(data.msg, toastOption);
        setSelect("");
        navigate("/myprofile");
      }
    } catch (error) {
      toast.error(data.msg, toastOption);
      console.log(error);
    }
  };

  return (
    <FunctionContext.Provider
      value={{
        logOut,
        handleUser,
        handlePic,
        RegisterUser,
        LoginUser,
        currentUserBlog,
        getBlog,
        getComments,
        createComment,
        handleComment,
        getAllComments,
        handleSelect,
        handleBlog,
        deleteBlog,
        createBlog,
        handleSearch,
        editBlog,
      }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionProvider;
