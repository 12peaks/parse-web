import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import NewEventModal from "@/app/_components/triage/NewEventModal";

export const NewEventButton = () => {
  const modals = useModals();
  const router = useRouter();

  const openNewEventModal = () => {
    modals.openModal({
      title: "Create a new event",
      size: "lg",
      children: (
        <NewEventModal handleNewEventNavigation={handleNewEventNavigation} />
      ),
    });
  };

  const handleNewEventNavigation = (eventId: string) => {
    router.push(`/triage/${eventId}`);
  };

  return (
    <div className="pl-2">
      <Button onClick={() => openNewEventModal()}>New event</Button>
    </div>
  );
};
