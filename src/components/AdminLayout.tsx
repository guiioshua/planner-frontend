import { ReactNode } from "react";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Mail, Users, Gift, Store, Menu } from "lucide-react";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Painel", url: "/", icon: LayoutDashboard },
  { title: "Convites", url: "/convites", icon: Mail },
  { title: "Convidados", url: "/convidados", icon: Users },
  { title: "Presentes", url: "/presentes", icon: Gift },
  { title: "Fornecedores", url: "/fornecedores", icon: Store },
];

function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/40">
      <SidebarContent className="pt-8">
        <div className="px-6 mb-8">
          <h2 className="font-serif text-lg tracking-wide">Nosso Casamento</h2>
          <BotanicalAccent variant="branch" className="w-24 mt-1 opacity-60" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-6 py-2.5 text-sm font-sans font-normal transition-colors hover:bg-muted/50"
                      activeClassName="bg-muted text-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-14 flex items-center border-b border-border/40 px-4 lg:px-8">
            <SidebarTrigger />
            <BotanicalAccent variant="corner" className="w-8 h-8 ml-auto opacity-30" />
          </header>
          <div className="p-6 lg:p-10 max-w-7xl">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
