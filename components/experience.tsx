"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
  type ToastInput,
} from "@/components/beui/animated-toast-stack";
import { Dock, DockItem } from "@/components/beui/dock";
import { Home, Calendar, Aircraft } from "@/components/beui/icons";
const ToastContext = createContext<(toast: ToastInput) => void>(() => {});
export const useToast = () => useContext(ToastContext);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const prompted = useRef(false);
  const { toasts, showToast, dismissToast } = useAnimatedToastStack({
    limit: 4,
    defaultDuration: 5000,
  });
  useEffect(() => {
    if (path.startsWith("/contact")) {
      dismissToast("missing-event");
      return;
    }
    if (prompted.current) return;
    try {
      if (sessionStorage.getItem("missing-event-prompt")) return;
    } catch { /* Storage may be unavailable; the ref still prevents repeats. */ }
    const timer = window.setTimeout(() => {
      prompted.current = true;
      try { sessionStorage.setItem("missing-event-prompt", "shown"); } catch {}
      showToast({
        id: "missing-event",
        title: "Are we missing an event?",
        description: <>Tell us <Link className="underline underline-offset-4" href="/contact/" onClick={() => dismissToast("missing-event")}>here</Link>.</>,
        status: "info",
        duration: 0,
      });
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [path, showToast, dismissToast]);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="airshow-theme-v2"
    >
      <ToastContext.Provider value={showToast}>
        {children}
        <AnimatedToastStack
          toasts={toasts}
          onDismiss={dismissToast}
          placement="fixed"
          maxVisible={3}
          className="airshow-toasts"
          classNames={{
            title: "!whitespace-normal",
            description: "!line-clamp-none",
            close: "!h-11 !w-11",
          }}
        />
      </ToastContext.Provider>
    </ThemeProvider>
  );
}
export function MobileDock() {
  const path = usePathname();
  const links = [
    { href: "/", label: "Discover", icon: Home, active: path === "/" },
    {
      href: "/calendar/",
      label: "Calendar",
      icon: Calendar,
      active: path.startsWith("/calendar") || path.startsWith("/airshows"),
    },
    {
      href: "/aircraft/",
      label: "Aircraft",
      icon: Aircraft,
      active: path.startsWith("/aircraft"),
    },
  ];
  return (
    <nav className="mobile-dock" aria-label="Mobile navigation">
      <Dock size={72} className="airshow-dock">
        {links.map((item) => (
          <DockItem
            key={item.href}
            active={item.active}
            className={item.active ? "dock-active" : ""}
          >
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          </DockItem>
        ))}
      </Dock>
    </nav>
  );
}
