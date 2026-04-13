"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  ImageIcon,
  Film,
  BarChart3,
  Search,
  Calendar,
  Settings,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Users,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/video-studio", label: "Video Studio", icon: Film },
  { href: "/library", label: "Libreria", icon: ImageIcon },
  { href: "/soul-builder", label: "Personajes", icon: Users },
  { href: "/campaigns", label: "Campanas", icon: BarChart3 },
  { href: "/competitors", label: "Competencia", icon: Search },
  { href: "/strategy", label: "Estrategia", icon: Calendar },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              ArbiStudio
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto h-8 w-8", collapsed && "ml-0")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Link href="/chat">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-2",
                collapsed && "justify-center px-0"
              )}
            >
              <Plus className="h-4 w-4" />
              {!collapsed && "Nueva conversacion"}
            </Button>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>

        {/* Recent conversations — loaded from localStorage in chat page */}
        {!collapsed && (
          <>
            <Separator />
            <div className="p-3">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Recientes
              </p>
              <ScrollArea className="h-40">
                <div className="space-y-1" id="sidebar-conversations">
                  <p className="px-2 text-xs text-muted-foreground/50">
                    Las conversaciones apareceran aqui
                  </p>
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
