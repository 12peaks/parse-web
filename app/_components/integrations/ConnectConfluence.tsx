import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/settings/atlassian`;
const confluenceTokenUrl = "https://auth.atlassian.com/oauth/token";

export const ConnectConfluence = () => {
  const router = useRouter();
  const [token, setToken] = useState(false);

  const confluenceAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=ztNqQs2yhmCiqVDe7xmFChNVpGxT0sPg&scope=offline_access%20search%3Aconfluence%20read%3Aconfluence-space.summary%20read%3Aconfluence-content.all%20read%3Aconfluence-groups&redirect_uri=https%3A%2F%2F${process.env.NEXT_PUBLIC_ATLASSIAN_SUBDOMAIN}.useparse.com%2Fsettings%2Fatlassian&state=${"hello"}&response_type=code&prompt=consent`;

  const handleConfluence = async () => {
    if (true) {
      window.location.assign(confluenceAuthUrl);
    } else {
      console.error("error getting token");
    }
  };

  const getConfluenceAccessToken = useCallback(async (code: string) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const postData = {
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_SECRET,
        code: code,
        redirect_uri: redirectUrl,
      };
      const response = await axios.post(confluenceTokenUrl, postData, {
        headers,
      });

      if (response.status === 200) {
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (
    window &&
    window.location.pathname.includes("atlassian") &&
    window.location.search.includes("?code=")
  ) {
    const tempCode = new URLSearchParams(window.location.search).get("code");
    if (tempCode && tempCode.length > 6) {
      getConfluenceAccessToken(tempCode).then(() => {
        ({ to: "/settings", replace: true });
      });
    }
  }

  const handleDisconnect = async () => {};

  return (
    <>
      {token ? (
        <Button color="red" variant="light" onClick={() => handleDisconnect()}>
          Disconnect
        </Button>
      ) : (
        <Button onClick={() => handleConfluence()} variant="light">
          Connect
        </Button>
      )}
    </>
  );
};
