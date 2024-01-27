/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { parseCookies } from "nookies";
import checkUserToken from "../../util/middleware/interceptor";
import axios from "axios";
import { BsFillTrashFill } from "react-icons/bs";
import { useSWRConfig } from "swr";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const PostStyle = styled.div`
  width: 100%;
  #motion {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding-top: 1rem;
  }
  #description {
    word-break: break-word; /* Chrome, Safari */
    overflow-wrap: anywhere; /* Firefox */
  }
`;

const Post = (props) => {
  const { mutate } = useSWRConfig();
  const [liked, setLiked] = React.useState(props.liked);
  const [likes, setLikes] = React.useState(props.likes);

  const handleDelete = (PostId) => {
    const parsedCookies = parseCookies();
    checkUserToken(parsedCookies.token, parsedCookies.refresh_token).then(
      async (res) => {
        if (res == true) {
          try {
            const res = await axios.delete(
              `https://clever-backend.onrender.com/api/posts/remove/${PostId}`,
              {
                headers: {
                  Authorization: `Bearer ${parsedCookies.token}`,
                },
              }
            );
            if (res.status == 201) {
              mutate("https://clever-backend.onrender.com/api/posts");
              toast.success("Successfully deleted the post.");
              return true;
            } else {
              toast.error("Failed to delete the post.");
              return false;
            }
          } catch (err) {
            toast.error("Failed to delete the post.");
            return false;
          }
        }
      }
    );
  };

  const likePost = (PostId) => {
    const hasLiked = !liked;
    setLiked(!liked);
    if (hasLiked) {
      setLikes(Number.parseInt(likes, 10) + 1);
    } else {
      setLikes(Number.parseInt(likes, 10) - 1);
    }
    const parsedCookies = parseCookies();
    return checkUserToken(
      parsedCookies.token,
      parsedCookies.refresh_token
    ).then(async (res) => {
      if (res == true) {
        try {
          const res = await axios.post(
            "https://clever-backend.onrender.com/api/posts/like",
            { postId: PostId },
            {
              headers: {
                Authorization: `Bearer ${parsedCookies.token}`,
              },
            }
          );

          if (res.status == 201) {
            if (res.data.message == "Liked") {
              // setLiked(true);
              // setLikes(Number.parseInt(likes, 10) + 1);
              return true;
            } else {
              // setLiked(false);
              // setLikes(Number.parseInt(likes, 10) - 1);
              return true;
            }
          } else {
          }
        } catch (err) {
          const hasLiked = !liked;
          setLiked(!liked);
          if (hasLiked) {
            setLikes(Number.parseInt(likes, 10) + 1);
          } else {
            setLikes(Number.parseInt(likes, 10) - 1);
          }
          toast.error("Failed to like the post.");
          return false;
        }
      } else {
        return false;
      }
    });
  };
  return (
    <PostStyle>
      <Toaster
        toastOptions={{
          position: "bottom-center",
          style: {
            background: "#23232f",
            color: "#fff",
          },
        }}
      />
      <motion.div
        id="motion"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div
          id="Profile"
          className="rounded-full max-w-[3.4rem] min-w-[3.4rem] w-full min-h-[3.4rem] max-h-[3.4rem] h-full"
        >
          {props.loading ? (
            <div className="rounded-full w-full h-full min-h-[3.4rem] bg-[#51516c]/50 animate-pulse"></div>
          ) : (
            <img
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${props.name}`}
              className="rounded-full bg-[#636382]"
              alt="Profile"
            />
          )}
        </div>
        <div id="PostContent" className="ml-4 w-full max-w-full">
          <div id="PostHeader" className="mb-[2px] flex items-center">
            {props.loading ? (
              <>
                <div className="rounded-md w-[80px] h-[1rem] bg-[#51516c]/50 animate-pulse mb-2"></div>
              </>
            ) : (
              <>
                <h4 className="text-white/90 font-semibold text-[0.9rem] sm:text-[1.05rem]">
                  {props.name}
                </h4>
                <h4 className="ml-1 text-white/50 font-light text-[0.8rem] sm:text-[0.9rem]">
                  {props.username} <span className="px-1">·</span> {props.time}
                </h4>
              </>
            )}
          </div>
          <div
            id="PostBody"
            className="flex w-full break-words whitespace-pre-wrap"
          >
            {props.loading ? (
              <div className="mb-1 rounded-md w-[50vw] max-w-[200px] h-[2rem] bg-[#51516c]/50 animate-pulse"></div>
            ) : (
              <span
                id="description"
                className="min-w-[1px] whitespace-pre-wrap text-white/75 text-[14px] sm:text-[15px] font-normal"
              >
                {props.body}
              </span>
            )}
          </div>
          <div
            id="PostActions"
            className="flex items-center justify-between w-full mt-2  "
          >
            <div className="flex items-center gap-x-7">
              <div
                id="comments"
                className="flex cursor-pointer items-center text-white/80 text-[0.90rem]"
              >
                <FaRegCommentAlt />
                <span className="ml-[0.45rem] text-[13px]">{"0"}</span>
              </div>

              <div
                id="likes"
                className="flex cursor-pointer items-center text-white/80 text-[1.2rem]"
                onClick={() => likePost(props.id)}
              >
                {liked ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart />
                )}
                <span className="ml-[0.35rem] text-[13px]">{likes || "0"}</span>
              </div>
            </div>
            {props.amITheAuthor && (
              <div className="flex items-center">
                <div
                  id="trash"
                  onClick={() => handleDelete(props.id)}
                  className="flex cursor-pointer items-center text-white/80 mr-2 text-[1rem]"
                >
                  <BsFillTrashFill />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </PostStyle>
  );
};

export default Post;
