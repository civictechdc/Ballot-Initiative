import { FileCheck, Home, Settings, Table } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
// Menu items.
export const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Voter Records",
    url: "/voter-records",
    icon: Table,
  },
  {
    title: "Petition Validation",
    url: "/petition",
    icon: FileCheck,
  },
];

const instructions = [
  {
    title: "1️⃣ Upload Voter Records",
    content: (
      <ul className="list-disc list-inside">
        <li>CSV format required</li>
        <li>Must include:</li>
        <ul className="list-disc list-inside">
          <li className="ml-4">First_Name</li>
          <li className="ml-4">Last_Name</li>
          <li className="ml-4">Street_Number</li>
          <li className="ml-4">Street_Name</li>
          <li className="ml-4">Street_Type</li>
          <li className="ml-4">Street_Dir_Suffix</li>
        </ul>
        <i>Example: Download a sample of fake voter records here.</i>
      </ul>
    ),
  },
  {
    title: "2️⃣ Upload Signatures",
    content: (
      <ul className="list-disc list-inside">
        <li>PDF format only</li>
        <li>Clear, legible scans</li>
        <li>One signature per line</li>
        <i>Example: Download a sample of fake signed petitions here.</i>
      </ul>
    ),
  },
  {
    title: "3️⃣ Process & Review",
    content: (
      <ul className="list-disc list-inside">
        <li>Click 'Process Files'</li>
        <li>Review matches</li>
        <li>Download CSV results</li>
        <i>Note: Moving to the 'Home' page will restart processing.</i>
      </ul>
    ),
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="m-2">
        <SidebarGroupLabel>
          <h2>
          Ballot Initiative
            </h2>
            </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className="m-f [overflow:overlay] [&::-webkit-scrollbar-track]:bg-black-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar]:w-2 h-screen">
        <SidebarGroup className="border-b dark:border-gray-500 border-black">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${location.pathname === item.url ? "bg-gray-200 dark:bg-gray-800 rounded-sm" : ""}`}
                >
                  <SidebarMenuButton asChild size='lg'>
                    <Link  to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="text-left p-5">
          {state === "expanded" && location.pathname === "/petition" && (
            <Accordion type="single" collapsible>
              <h1 className="mb-5">📝 Instructions</h1>
              {instructions.map((instruction) => (
                <AccordionItem
                  key={instruction.title}
                  value={instruction.title}
                  className="px-4 mb-5 dark:border-gray-500 border-black border-1 rounded-sm"
                >
                  <AccordionTrigger>{instruction.title}</AccordionTrigger>
                  <AccordionContent>{instruction.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          {state === "expanded" && location.pathname === "/" && (
            <div className="p-5 bg-green-400/30 text-white rounded-sm">
              👆Visit the Petition Validation page to get started.
            </div>
          )}
        </SidebarGroup>
        {}
      </SidebarContent>
      <SidebarFooter className="flex flex-row mb-4">
        <SidebarMenuItem key="Settings">
          <SidebarMenuButton asChild size='lg'>
            <a href="/settings">
              <Settings />
              <span>{"Settings"}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
