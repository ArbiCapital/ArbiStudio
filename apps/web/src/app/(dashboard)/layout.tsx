"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Mic,
  LogOut,
  LayoutGrid,
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
import { createClient } from "@/lib/supabase/client";
import { listConversations, type StoredConversation } from "@/lib/chat-storage";

const NAV_ITEMS = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/video-studio", label: "Video Studio", icon: Film },
  { href: "/library", label: "Libreria", icon: ImageIcon },
  { href: "/soul-builder", label: "Personajes", icon: Users },
  { href: "/lipsync", label: "Lipsync", icon: Mic },
  { href: "/instagram", label: "Instagram", icon: ImageIcon },
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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState<StoredConversation[]>([]);

  // Load conversations from localStorage
  useEffect(() => {
    setConversations(listConversations());
    // Poll for changes every 2s (when user generates content in chat)
    const interval = setInterval(() => {
      setConversations(listConversations());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "max-md:absolute max-md:z-50 max-md:h-full",
          collapsed && "max-md:w-0 max-md:border-0 max-md:overflow-hidden"
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
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
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
              onClick={() => {
                // Force new conversation by adding timestamp param
                router.push("/chat?new=" + Date.now());
              }}
            >
              <Plus className="h-4 w-4" />
              {!collapsed && "Nueva conversacion"}
            </Button>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
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

        {/* Recent conversations from localStorage */}
        {!collapsed && (
          <>
            <Separator />
            <div className="p-3">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Recientes
              </p>
              <ScrollArea className="h-40">
                <div className="space-y-0.5">
                  {conversations.length === 0 ? (
                    <p className="px-2 text-xs text-muted-foreground/50">
                      Sin conversaciones aun
                    </p>
                  ) : (
                    conversations.slice(0, 15).map((conv) => (
                      <Link
                        key={conv.id}
                        href={`/chat?id=${conv.id}`}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                          "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        <MessageSquare className="h-3 w-3 shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </Link>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Hub + Logout */}
        <div className="mt-auto shrink-0 border-t border-border p-3 space-y-1">
          <a
            href="https://hub.arbicapitaluae.com"
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            {!collapsed && "ArbiCapital Hub"}
          </a>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-muted-foreground hover:text-destructive",
              collapsed && "justify-center px-0"
            )}
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push("/login");
              router.refresh();
            }}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Cerrar sesion"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
