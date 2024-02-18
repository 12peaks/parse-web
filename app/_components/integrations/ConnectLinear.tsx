import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mantine/core";
import Link from "next/link";

const ConnectLinear = () => {
  const buildLinearAuthUrl = () => {
    console.log("Building Linear auth URL");
    return "https://google.com";
  };

  return (
    <>
      {false ? (
        <Button color="red" variant="light">
          Disconnect
        </Button>
      ) : (
        <Button component={Link} href={buildLinearAuthUrl()} variant="light">
          Connect
        </Button>
      )}
    </>
  );
};

export default ConnectLinear;
