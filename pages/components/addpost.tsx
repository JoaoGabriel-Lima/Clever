/* eslint-disable react/react-in-jsx-scope */
import TextareaAutosize from "react-textarea-autosize";
import toast, { Toaster } from "react-hot-toast";
import { MdAddCircleOutline } from "react-icons/md";
import { BiCodeAlt, BiLoaderAlt, BiText } from "react-icons/bi";
import { FiAtSign } from "react-icons/fi";
import { AiOutlineGif } from "react-icons/ai";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { parseCookies } from "nookies";
import checkUserToken from "../middleware/interceptor";
import axios from "axios";

const AddPost = () => {
  const { mutate } = useSWRConfig();
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);

  const addPostFn = (post) => {
    const parsedCookies = parseCookies();
    return checkUserToken(
      parsedCookies.token,
      parsedCookies.refresh_token
    ).then((res) => {
      if (res == true) {
        return axios
          .post("http://192.168.100.95:8080/api/posts/add", post, {
            headers: {
              Authorization: `Bearer ${parsedCookies.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              return true;
            } else {
              return false;
            }
          });
      } else {
        return false;
      }
    });
  };

  const addPost = () => {
    if (postContent.trim() === "") {
      return;
    }
    setLoading(true);
    const newPost = {
      content: postContent,
    };
    try {
      addPostFn(newPost).then((res) => {
        if (res == true) {
          setPostContent("");
          mutate("http://192.168.100.95:8080/api/posts");
          toast.success("Successfully added the new post.");
          setLoading(false);
        } else {
          setLoading(false);
          toast.error("Failed to add the new post.");
        }
      });
    } catch (e) {
      setLoading(false);
      toast.error("Failed to add the new item.");
    }
  };
  return (
    <>
      <Toaster
        toastOptions={{
          position: "bottom-center",
          style: {
            background: "#23232f",
            color: "#fff",
          },
        }}
      />
      <div className=" mb-5 w-full min-h-[5rem] rounded-md bg-[#51516c]/20 flex flex-col ">
        <TextareaAutosize
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          maxLength={280}
          disabled={loading}
          minRows={1}
          maxRows={6}
          className="w-full h-full text-normal sm:overflow-hidden focus:outline-none  resize-none min-h-[3rem] bg-transparent rounded-md px-5 pt-5 pb-7 text-white"
          placeholder="Share your knowledge..."
        ></TextareaAutosize>
        <div className="flex w-full flex-col sm:flex-row sm:justify-between itens-center h-auto px-5 pb-4 pt-3">
          <div className="flex items-center text-white/80 gap-x-5 text-[1.4rem]">
            <MdAddCircleOutline className="cursor-pointer" />
            <BiCodeAlt className="cursor-pointer text-[1.55rem]" />
            <FiAtSign className="cursor-pointer text-[1.36rem]" />
            <AiOutlineGif className="cursor-pointer text-[1.7rem]" />
            <BiText className="cursor-pointer" />
          </div>
          <div className="sm:mt-0 mt-4">
            <button
              onClick={() => addPost()}
              disabled={loading}
              className={`${
                loading || postContent.trim() === ""
                  ? "bg-[#3750b8] cursor-not-allowed text-white/70"
                  : "bg-[#4c6fff] text-white"
              } rounded-md text-white font-medium w-full sm:w-auto h-10 px-7 flex justify-center items-center`}
            >
              {loading ? (
                <BiLoaderAlt className="text-white animate-spin text-2xl" />
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPost;
