import { HistoryData } from "@/entities/history/model";
import { StickyHistoriesHeader } from "./StickyHistoriesHeader";
import { ChapterHeading } from "@/components/shared";

interface HistoriesProps {
  histories: HistoryData[];
  currentHistoryId: number;
}

export const Histories: React.FC<HistoriesProps> = ({
  histories,
  currentHistoryId,
}) => {
  return (
    <>
      <div className="mx-auto">
        <ChapterHeading className="my-3">Истории</ChapterHeading>
      </div>
      <StickyHistoriesHeader
        histories={histories}
        currentHistoryId={currentHistoryId}
      />
    </>
  );
};
