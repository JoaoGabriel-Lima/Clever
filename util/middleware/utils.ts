import axios from "axios";
import nookies from "nookies";
// import { setCookie, destroyCookie } from "nookies";

/* eslint-disable require-jsdoc */
export default async function getUserData(jwtToken, refreshToken, ctx) {
  try {
    // console.log(process.env.REACT_APP_API_URL);
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (data.status === 201) {
      return data.data.data;
    }
  } catch (error) {
    // check if error code is 401
    if (error.response != undefined) {
      if (error.response.status === 401) {
        // refresh token
        try {
          const data = await axios.post(
            `${process.env.REACT_APP_API_URL}/refresh-token`,
            {
              refresh_token: refreshToken,
            }
          );
          if (data) {
            // save new tokens
            nookies.set(ctx, "token", data.data.token, {
              maxAge: 15 * 60,
              path: "/",
            });
            if (data.data.newRefreshToken) {
              nookies.set(ctx, "refresh_token", data.data.newRefreshToken.id, {
                maxAge: 10 * 24 * 60 * 60,
                path: "/",
              });
              return getUserData(
                data.data.token,
                data.data.newRefreshToken.id,
                ctx
              );
            }
            return getUserData(data.data.token, refreshToken, ctx);
            // get user data
          }
        } catch (error) {
          // logout
          nookies.destroy(ctx, "token");
          nookies.destroy(ctx, "refresh_token");
          return false;
        }
      } else {
        console.log(error.response.status);
        return false;
      }
    } else {
      return false;
    }
  }
}
export async function getPosts(jwtToken, refreshToken, ctx) {
  try {
    // console.log(process.env.REACT_APP_API_URL);
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (data.status === 201) {
      return data.data.data;
    }
  } catch (error) {
    // check if error code is 401
    if (error.response != undefined) {
      if (error.response.status === 401) {
        // refresh token
        try {
          const data = await axios.post(
            `${process.env.REACT_APP_API_URL}/refresh-token`,
            {
              refresh_token: refreshToken,
            }
          );
          if (data) {
            // save new tokens
            nookies.set(ctx, "token", data.data.token, {
              maxAge: 15 * 60,
              path: "/",
            });
            if (data.data.newRefreshToken) {
              nookies.set(ctx, "refresh_token", data.data.newRefreshToken.id, {
                maxAge: 10 * 24 * 60 * 60,
                path: "/",
              });
              return getUserData(
                data.data.token,
                data.data.newRefreshToken.id,
                ctx
              );
            }
            return getUserData(data.data.token, refreshToken, ctx);
            // get user data
          }
        } catch (error) {
          // logout
          nookies.destroy(ctx, "token");
          nookies.destroy(ctx, "refresh_token");
          return false;
        }
      } else {
        console.log(error.response.status);
        return false;
      }
    } else {
      return false;
    }
  }
}
