"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { WifiOff, Wifi } from "lucide-react";

export function NetworkStatus() {
  const offlineToastId = useRef<string | number | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      offlineToastId.current = toast.error("No internet connection", {
        description: "Check your network and try again.",
        duration: Infinity,
        icon: <WifiOff size={16} />,
      });
    };

    const handleOnline = () => {
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }
      toast.success("Back online", {
        description: "Your connection has been restored.",
        duration: 3000,
        icon: <Wifi size={16} />,
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}
