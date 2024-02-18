import { Button } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

export const ConnectNotion: React.FC = () => {
  const buildAuthUrl = () => {
    console.log("Building Notion auth URL");
    return "https://google.com";
  };

  const handleDisconnect = () => {
    console.log("Disconnecting from Notion");
  };

  return (
    <div>
      {false ? (
        <Button variant="light" color="red" onClick={() => handleDisconnect()}>
          Disconnect
        </Button>
      ) : (
        <Button component="a" href={buildAuthUrl()} variant="light">
          Connect
        </Button>
      )}
    </div>
  );
};
