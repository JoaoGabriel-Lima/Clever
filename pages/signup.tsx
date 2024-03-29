/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { HomeCointainer } from "../styles/components/home";
import Input from "./components/input";
import Link from "next/link";
import { motion } from "framer-motion";
import getUserData from "../util/middleware/utils";
import nookies, { setCookie } from "nookies";
import { useRouter } from "next/router";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";

const SingUp: NextPage = () => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://clever-backend.onrender.com/api/users",
        {
          name: name,
          username: username,
          email: email,
          password: password,
        },
      );

      if (response) {
        if (response.status === 201) {
          try {
            const response = await axios.post(
              "https://clever-backend.onrender.com/api/login",
              {
                email: email,
                password: password,
              },
            );

            if (response) {
              if (response.status === 200) {
                setCookie(null, "token", response.data.data.token, {
                  maxAge: 15 * 60,
                  path: "/",
                });
                setCookie(
                  null,
                  "refresh_token",
                  response.data.data.refreshToken.id,
                  {
                    maxAge: 10 * 24 * 60 * 60,
                    path: "/",
                  },
                );
                setLoading(false);
                router.push("/dashboard");
              }
            }
          } catch (e) {
            setError("Something went wrong");
            setLoading(false);
            router.push("/");
          }
        }
      }
    } catch (e) {
      if (e.response.status === 400) {
        setError(e.response.data.message);
        setLoading(false);
      } else {
        setError("Server error");
        setLoading(false);
      }
    }
  };
  return (
    <HomeCointainer>
      <Head>
        <title>Clever - SignUp</title>
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
            Sign up to <span className="text-[#5779ff]">Clever</span>
          </h1>
          <form className="w-full" onSubmit={handleRegister}>
            <div className="flex flex-col justify-start itens-start w-full mt-10">
              <Input
                title="Name"
                placeholder="John Doe"
                type="text"
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                title="Username"
                placeholder="@johndoe01"
                type="text"
                disabled={loading}
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.replace(/[^a-zA-Z0-9_ ]/g, "").toLowerCase(),
                  )
                }
                required
              />
              <Input
                title="E-mail"
                placeholder="Your account e-mail"
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                title="Password"
                placeholder="Your account password"
                type="password"
                minLength={8}
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                title="Confirm Password"
                placeholder="Confirm Your password"
                type="password"
                minLength={8}
                disabled={loading}
                requirement="Your password must be 8 characters at least"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error.trim() != "" && (
              <div>
                <p className="text-red-500 text-xs">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className={`w-full flex justify-center items-center h-12 mt-6  ${
                error.trim() != ""
                  ? "bg-red-600 text-white/70 cursor-pointer"
                  : loading
                  ? "bg-[#405ed8] cursor-not-allowed"
                  : "bg-[#4c6fff] text-white"
              } rounded-md  font-medium`}
              disabled={loading}
            >
              {loading ? (
                <BiLoaderAlt className="text-white animate-spin text-2xl" />
              ) : (
                "Sign up"
              )}
            </button>
          </form>
          <p className="text-center mt-4 text-white/80 text-[14px]">
            Already have an account?{" "}
            <Link href="/">
              <a className="underline text-white/80 text-[14px]">Sign In</a>
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
export default SingUp;
