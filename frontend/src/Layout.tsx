import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, items } from "@/components/sidebar";
import { ModeToggle } from "./components/theme-provider/mode-toggle";
import { useLocation } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col min-h-screen">
        <header className="text-left flex">
          <SidebarTrigger className="text-2xl"/>
          <h2>
            {items.find((item) => item.url === location.pathname)?.title}
          </h2>
        </header>
        <main className="w-full">
          {children}
          <ModeToggle />
          <Toaster />
        </main>
        <footer className="centered mt-auto mb-4">
          © {new Date().getFullYear()} Ballot Initiative Project
        </footer>
      </div>
    </SidebarProvider>
  );
}
