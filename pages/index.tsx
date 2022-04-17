/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { HomeCointainer } from "../styles/components/home";
import Input from "./components/input";
import Link from "next/link";
import { BsGoogle } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { BiLoaderAlt } from "react-icons/bi";
import { setCookie } from "nookies";
import axios from "axios";
import nookies from "nookies";
import getUserData from "../util/middleware/utils";

const SignIn: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    // wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await axios.post(
        "https://cleverbackend.herokuapp.com/api/login",
        {
          email: email,
          password: password,
        }
      );

      if (response) {
        if (response.status === 200) {
          setCookie(null, "token", response.data.data.token, {
            maxAge: 15 * 60,
            path: "/",
          });
          setCookie(null, "refresh_token", response.data.data.refreshToken.id, {
            maxAge: 10 * 24 * 60 * 60,
            path: "/",
          });
          setIsLoading(false);
          router.push("/dashboard");
        }
      }
    } catch (e) {
      setError(true);
      setIsLoading(false);
    }
  };
  return (
    <HomeCointainer>
      <Head>
        <title>Clever - SignIn</title>

        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center w-full p-7 py-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start items-center flex-col w-full max-w-[600px]"
        >
          <h1 className="text-white text-4xl font-semibold text-center leading-snug">
            Sign in to <span className="text-[#5779ff]">Clever</span>
          </h1>
          <div className="mt-10 flex h-auto w-auto gap-x-5 gap-y-4 flex-wrap justify-center">
            <button className="bg-[#51516c]/30 text-black rounded-lg w-20 h-14 flex justify-center items-center">
              <BsGoogle className="text-2xl text-white" />
            </button>
            <button className="bg-[#51516c]/30 text-black rounded-lg w-20 h-14 flex justify-center items-center">
              <BsApple className="text-2xl text-white" />
            </button>
            <button className="bg-[#51516c]/30 text-black rounded-lg w-20 h-14 flex justify-center items-center">
              <BsFacebook className="text-2xl text-white" />
            </button>
          </div>
          <div className="mt-10 flex items-center text-white w-full justify-center">
            <hr className="w-full border-slate-300/30" />
            <p className="px-5  whitespace-nowrap text-slate-300/70 text-center">
              or do it via E-mail
            </p>
            <hr className="w-full border-slate-300/30" />
          </div>
          <form onSubmit={handleLogin} className="w-full">
            <div className="flex flex-col justify-start itens-start w-full mt-10">
              <Input
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                title="E-mail"
                placeholder="@mail.com"
                type="email"
              />
              <Input
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                title="Password"
                placeholder="Your account password"
                type="password"
                // requirement="Your password must be 8 characters at least"
              />
            </div>
            {error && (
              <div>
                <p className="text-red-500 text-xs">
                  The email or password you entered is incorrect.
                </p>
              </div>
            )}
            <button
              type="submit"
              className={`w-full flex justify-center items-center h-12 mt-6  ${
                error
                  ? "bg-red-600 text-white/70 cursor-pointer"
                  : isLoading
                  ? "bg-[#405ed8] cursor-not-allowed"
                  : "bg-[#4c6fff] text-white"
              } rounded-md  font-medium`}
              disabled={isLoading}
            >
              {isLoading ? (
                <BiLoaderAlt className="text-white animate-spin text-2xl" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
          <p className="text-center mt-4 text-white/80 text-[14px]">
            Don't have an account?{" "}
            <Link href="/signup">
              <a className="underline text-white/80 text-[14px]">
                Create an account
              </a>
            </Link>
          </p>
        </motion.div>
      </main>
    </HomeCointainer>
  );
};
export async function getServerSideProps(context) {
  // const { req } = context;

  const { token, refresh_token } = nookies.get(context);
  if (!refresh_token) {
    return {
      props: {
        props: {},
      },
    };
  }
  const res = await getUserData(token, refresh_token, context);
  if (res) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
      props: {
        auth: res,
      },
    };
  } else {
    return {
      props: {
        props: {},
      },
    };
  }
}

export default SignIn;
