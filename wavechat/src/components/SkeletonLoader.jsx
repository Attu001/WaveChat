import { motion } from "framer-motion";

const shimmer = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

const SkeletonBlock = ({ className = "", style = {} }) => (
  <motion.div
    variants={shimmer}
    initial="initial"
    animate="animate"
    className={`skeleton ${className}`}
    style={style}
  />
);

export const ChatSkeleton = ({ count = 6 }) => (
  <div className="flex flex-col gap-3 p-4">
    {Array.from({ length: count }).map((_, i) => {
      const isMine = i % 2 === 0;
      return (
        <div
          key={i}
          className={`flex ${isMine ? "justify-end" : "justify-start"} gap-2`}
        >
          {!isMine && <SkeletonBlock className="w-8 h-8 !rounded-full flex-shrink-0" />}
          <div className={`flex flex-col gap-1.5 ${isMine ? "items-end" : "items-start"}`}>
            <SkeletonBlock
              className={`h-10 !rounded-2xl ${isMine ? "!rounded-br-md" : "!rounded-bl-md"}`}
              style={{ width: `${80 + Math.random() * 120}px` }}
            />
            <SkeletonBlock className="h-3 w-16 !rounded-md" />
          </div>
          {isMine && <SkeletonBlock className="w-8 h-8 !rounded-full flex-shrink-0" />}
        </div>
      );
    })}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col">
    {/* Header */}
    <div className="px-6 pt-10 pb-16" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="flex items-center gap-5">
        <SkeletonBlock className="w-24 h-24 !rounded-full" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-6 w-36 !rounded-lg" />
          <SkeletonBlock className="h-4 w-48 !rounded-lg" />
          <SkeletonBlock className="h-3 w-28 !rounded-lg" />
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="mx-4 mt-4">
      <SkeletonBlock className="h-14 w-full !rounded-2xl" />
    </div>

    {/* Info */}
    <div className="mx-4 mt-4">
      <SkeletonBlock className="h-40 w-full !rounded-2xl" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 5 }) => (
  <div className="flex flex-col gap-2 p-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <SkeletonBlock className="w-12 h-12 !rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBlock className="h-4 w-32 !rounded-lg" />
          <SkeletonBlock className="h-3 w-24 !rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid gap-4 p-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="!rounded-2xl p-4 card">
        <div className="flex items-center gap-3 mb-3">
          <SkeletonBlock className="w-10 h-10 !rounded-full" />
          <div className="flex flex-col gap-1.5">
            <SkeletonBlock className="h-4 w-24 !rounded-lg" />
            <SkeletonBlock className="h-3 w-16 !rounded-lg" />
          </div>
        </div>
        <SkeletonBlock className="h-4 w-full !rounded-lg mb-2" />
        <SkeletonBlock className="h-4 w-3/4 !rounded-lg" />
        <SkeletonBlock className="h-48 w-full !rounded-xl mt-3" />
      </div>
    ))}
  </div>
);

const SkeletonLoader = ({ type = "chat", count }) => {
  switch (type) {
    case "chat":
      return <ChatSkeleton count={count} />;
    case "profile":
      return <ProfileSkeleton />;
    case "list":
      return <ListSkeleton count={count} />;
    case "card":
      return <CardSkeleton count={count} />;
    default:
      return <ChatSkeleton count={count} />;
  }
};

export default SkeletonLoader;

/* Re-export the shimmer styles to be used inline */
export { SkeletonBlock };