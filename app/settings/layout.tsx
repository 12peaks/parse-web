"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, UnstyledButton } from "@mantine/core";
import {
  IconBell,
  IconCreditCard,
  IconLogout,
  IconComponents,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { signOut } from "@/api/users";
import Link from "next/link";

const subNavigation = [
  { name: "Profile", href: "/team", icon: IconUserCircle, current: false },
  {
    name: "Integrations",
    href: ".",
    icon: IconComponents,
    current: false,
  },
  { name: "Notifications", href: "#", icon: IconBell, current: false },
  { name: "Account", href: "#", icon: IconSettings, current: false },
  { name: "Billing", href: "#", icon: IconCreditCard, current: false },
];

export default function Settings({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return (
    <div className="relative">
      <div className="mx-auto pb-6 lg:pb-16">
        <div className="rounded-lg shadow overflow-hidden border theme-border">
          <div className="divide-y theme-divide lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            <aside className="py-6 lg:col-span-3">
              <nav className="space-y-1">
                {subNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group border-l-4 px-6 py-2 flex items-center text-sm font-medium border-transparent theme-text-subtle hover:theme-bg-subtle hover:theme-text"
                  >
                    <item.icon
                      className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
                <UnstyledButton
                  className="w-full"
                  onClick={() => signOutMutation.mutate()}
                >
                  <div className="group border-l-4 px-6 py-2 flex items-center text-sm font-medium border-transparent theme-text-subtle hover:theme-bg-subtle hover:theme-text">
                    <IconLogout
                      className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <span className="truncate">Sign out</span>
                  </div>
                </UnstyledButton>
              </nav>
            </aside>
            <div className="divide-y theme-divide lg:col-span-9">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
