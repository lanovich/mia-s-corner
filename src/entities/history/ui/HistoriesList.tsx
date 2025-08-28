import Link from "next/link";
import { LINKS } from "@/constants";
import { HistoryData } from "@/entities/history/model";

interface HistoriesListProps {
  histories: HistoryData[];
  currentHistoryId: number;
}

export const HistoriesList: React.FC<HistoriesListProps> = ({
  histories,
  currentHistoryId,
}) => {
  return (
    <div className="flex gap-4">
      {histories.map((history) => (
        <Link
          key={history.id}
          href={`${LINKS.CATALOG}/${LINKS.HISTORIES}/${history.id}`}
          className={`px-4 py-2 rounded-full transition text-nowrap ${
            Number(currentHistoryId) === history.id
              ? "bg-black text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {history.title}
        </Link>
      ))}
    </div>
  );
};
