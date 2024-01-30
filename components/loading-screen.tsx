import Spinner from "@/components/spinner";

export default function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-36 sm:min-h-0">
      <Spinner screen />
    </div>
  );
}
