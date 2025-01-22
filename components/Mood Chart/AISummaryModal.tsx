import { JournalEntry } from "@/types/journal";
import ReactModal from "react-modal";
import { Button } from "../ui/button";
import { useEntry } from "@/hooks/useEntry";
import { useEffect, useState } from "react";
interface AISummaryModalProps {
  isSummaryModalOpen: boolean;
  handleSummaryModal: () => void;
  entry: JournalEntry;
}
export default function AISummaryModal(props: AISummaryModalProps) {
  const { isSummaryModalOpen, handleSummaryModal, entry } = props;
  const { summarizeEntry } = useEntry();
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function generateSummary() {
    setIsLoading(true);
    const summary = await summarizeEntry(entry);
    setSummary(summary);
    setIsLoading(false);
  }

  useEffect(() => {
    generateSummary();
  }, [entry]);

  const summaryText = (
    <p className="text-[#FF8B8B]/70 whitespace-pre-wrap">{summary}</p>
  );

  const loading = <p className="text-[#FF8B8B]/70">Loading...</p>;
  return (
    <ReactModal
      isOpen={isSummaryModalOpen}
      ariaHideApp={false}
      className="max-w-md max-h-md min-h-1/4 min-w-1/4 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-col flex">
        <div className="flex flex-row justify-between items-center mb-4">
          <p className="text-lg font-medium text-[#FF8B8B]">Summary</p>
          <Button onClick={handleSummaryModal} className="ml-4">
            X
          </Button>
        </div>
        {isLoading ? loading : summaryText}
        <div className="mb-4"></div>
        <div>
          <Button
            className="mx-2"
            onClick={async () => {
              generateSummary();
            }}
          >
            Re-Analyze
          </Button>
          <Button className="mx-2">Save</Button>
        </div>
      </div>
    </ReactModal>
  );
}
