import { useNavigation } from "react-router";

const NavigationProgress = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  if (!isNavigating) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-blue-950/40 overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-full w-1/3 bg-blue-500 animate-nav-progress" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
};

export default NavigationProgress;
