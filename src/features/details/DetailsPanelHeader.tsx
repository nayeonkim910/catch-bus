import { SectionHeading } from '../../shared/components/ui/PanelSection';
import type { BusStation } from '../../shared/types/bus';
import { formatUpdatedTime } from '../../shared/utils/arrival';
import { StationSummary } from './StationSummary';

type DetailsPanelHeaderProps = {
  station: BusStation;
  updatedAt?: string;
};

export function DetailsPanelHeader({ station, updatedAt }: DetailsPanelHeaderProps) {
  return (
    <section className="flex shrink-0 items-start justify-between gap-3 p-4 sm:p-5 lg:px-5 lg:py-4">
      <div className="min-w-0 flex-1">
        <div className="mb-2 lg:hidden">
          <SectionHeading>정류장 상세</SectionHeading>
        </div>
        <StationSummary station={station} />
      </div>
      {updatedAt && (
        <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
          {formatUpdatedTime(updatedAt)} 기준
        </span>
      )}
    </section>
  );
}
