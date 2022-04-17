/* eslint-disable camelcase */
import axios from "axios";
import { destroyCookie, setCookie } from "nookies";

const checkUserToken = async (token, refreshToken) => {
  try {
    const auth = await axios.get(`http://192.168.100.95:8080/api/check-token`, {
      headers: {
        Authorization: `Bearer ${token || "3536364758758585"}`,
      },
    });
    if (auth.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response != undefined) {
      if (error.response.status === 401) {
        // refresh token
        try {
          const data = await axios.post(
            `http://192.168.100.95:8080/api/refresh-token`,
            {
              refresh_token: refreshToken || "4545454646",
            }
          );
          if (data) {
            // save new tokens
            setCookie(null, "token", data.data.token, {
              maxAge: 15 * 60,
              path: "/",
            });
            if (data.data.newRefreshToken) {
              setCookie(null, "refresh_token", data.data.newRefreshToken.id, {
                maxAge: 10 * 24 * 60 * 60,
                path: "/",
              });
              return checkUserToken(
                data.data.token,
                data.data.newRefreshToken.id
              );
            }
            return checkUserToken(data.data.token, refreshToken);
            // get user data
          }
        } catch (error) {
          // logout
          destroyCookie(null, "token");
          destroyCookie(null, "refresh_token");
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};

export default checkUserToken;
