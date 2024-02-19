"use client";
import { Avatar, Button } from "@mantine/core";
import linearLogo from "@/public/linear-logo.svg";
import jiraLogo from "@/public/jira-icon.svg";
import confluenceLogo from "@/public/confluence.svg";
import githubLogo from "@/public/github.svg";
import ConnectLinear from "@/app/_components/integrations/ConnectLinear";
import { ConnectGoogleDrive } from "@/app/_components/integrations/ConnectGoogleDrive";
import { ConnectGoogleCalendar } from "@/app/_components/integrations/ConnectGoogleCalendar";
import { ConnectConfluence } from "@/app/_components/integrations/ConnectConfluence";
import { ConnectNotion } from "@/app/_components/integrations/ConnectNotion";

export default function Integrations() {
  let integrations = [
    {
      name: "Google Calendar",
      logo: "https://lh3.googleusercontent.com/K0vgpnn9Vour8ByU3htR3ou5Cx70Me-lW_51VEAIS5dfzXCQ0otXakVuPiQVc0V6qcf9aP_vkVul59airN27m3mttf4zQ1TPv4MVrw",
      description: "See upcoming meetings and events",
      connected: false,
    },
    {
      name: "Linear",
      logo: linearLogo.src,
      description: "Create tasks using #filetask in post comments",
      connected: true,
    },
    {
      name: "Confluence",
      logo: confluenceLogo.src,
      description: "Search your Confluence docs and wikis within Parse",
      connected: false,
    },
    {
      name: "Notion",
      logo: "https://www.notion.so/cdn-cgi/image/format=auto,width=256,quality=100/front-static/shared/icons/notion-app-icon-3d.png",
      description: "Search your Notion workspace within Parse",
      connected: false,
    },
    {
      name: "Jira",
      logo: jiraLogo.src,
      description: "Create tasks using #filetask and get updates",
      connected: false,
    },
    {
      name: "Github",
      logo: githubLogo.src,
      description:
        "Create issues and automatically comment when issues are closed",
      connected: false,
    },
  ];

  return (
    <div className="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 className="text-lg leading-6 font-medium theme-text">
          Integrations
        </h2>
        <p className="mt-1 text-sm theme-text-subtle">
          Add integrations to give your Parse account superpowers.
        </p>
      </div>

      <div className="mt-6 flex flex-col">
        {integrations.map((integration, idx) => (
          <div
            key={idx}
            className="relative rounded-lg border theme-border  px-6 py-5 mb-4 shadow-sm flex items-center space-x-3"
          >
            <div className="flex-shrink-0">
              <Avatar
                className="h-10 w-10 rounded-full"
                src={integration.logo}
                alt={integration.name}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium theme-text">
                {integration.name}
              </p>
              <p className="text-sm theme-text-subtle truncate">
                {integration.description}
              </p>
            </div>
            <div>
              {integration.name === "Slack" && (
                <Button disabled>Connected</Button>
              )}
              {integration.name === "Linear" && <ConnectLinear />}
              {integration.name === "Google Drive" && <ConnectGoogleDrive />}
              {integration.name === "Google Calendar" && (
                <ConnectGoogleCalendar />
              )}
              {integration.name === "Confluence" && <ConnectConfluence />}
              {integration.name === "Notion" && <ConnectNotion />}
              {integration.name === "Jira" && (
                <Button variant="light" disabled color="gray">
                  Coming soon
                </Button>
              )}
              {integration.name === "Github" && (
                <Button variant="light" disabled color="gray">
                  Coming soon
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
