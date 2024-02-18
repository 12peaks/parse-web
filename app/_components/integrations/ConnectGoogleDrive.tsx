import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mantine/core";

export const ConnectGoogleDrive = () => {
  const handleDisconnect = async () => {
    console.log("Disconnecting");
  };

  const handleGoogle = async () => {
    console.log("Connecting");
  };

  return (
    <>
      {false ? (
        <Button color="red" variant="light" onClick={() => handleDisconnect()}>
          Disconnect
        </Button>
      ) : (
        <Button onClick={() => handleGoogle()} variant="light">
          Connect
        </Button>
      )}
    </>
  );
};
