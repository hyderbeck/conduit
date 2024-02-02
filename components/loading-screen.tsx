import Spinner from "@/components/spinner";
import clsx from "clsx";

export default function LoadingScreen({ full }: { full?: boolean }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        full ? "flex-1" : "mt-16 mb-8"
      )}
    >
      <Spinner screen />
    </div>
  );
}
