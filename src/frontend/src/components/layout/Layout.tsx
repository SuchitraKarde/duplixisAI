import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  /** When true, hides the footer (e.g. full-screen tool pages) */
  hideFooter?: boolean;
  /** When true, removes top padding so hero sections can bleed into header */
  noTopPadding?: boolean;
}

export function Layout({
  children,
  hideFooter = false,
  noTopPadding = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main
        className={`flex-1 ${noTopPadding ? "" : "pt-16"}`}
        data-ocid="layout.main"
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
      <Toaster richColors position="top-right" />
    </div>
  );
}
