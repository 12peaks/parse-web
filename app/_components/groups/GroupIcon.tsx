import speechBalloon from "@/public/speech_balloon.png";

type GroupIconProps = {
  groupImage: string | undefined;
  size: number | null;
};

export const GroupIcon = ({ groupImage, size }: GroupIconProps) => {
  return (
    <div className={`p-1 rounded mr-3`}>
      {groupImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="icon"
          src={groupImage}
          className={size ? `h-${size} w-${size}` : "h-5 w-5"}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="icon"
          src={speechBalloon.src}
          className={size ? `h-${size} w-${size}` : "h-5 w-5"}
        />
      )}
    </div>
  );
};
