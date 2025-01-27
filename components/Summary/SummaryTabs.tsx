import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface SummaryTabsProps {
  activeTab: "all" | "entry" | "chat";
  onTabChange: (tab: "all" | "entry" | "chat") => void;
}

export function SummaryTabs({ activeTab, onTabChange }: SummaryTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange as (value: string) => void}
      className="w-full mb-8"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Summaries</TabsTrigger>
        <TabsTrigger value="entry">Journal Entries</TabsTrigger>
        <TabsTrigger value="chat">Chat Summaries</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
