import { SectionHeading } from '../../shared/components/PanelSection'
import type { BusStation } from '../../shared/types/bus'
import { formatUpdatedTime } from '../../shared/utils/arrival'
import { StationSummary } from './StationSummary'

type DetailsPanelHeaderProps = {
  station: BusStation
  updatedAt?: string
}

export function DetailsPanelHeader({
  station,
  updatedAt,
}: DetailsPanelHeaderProps) {
  return (
    <section className="flex shrink-0 justify-between p-4 sm:p-5 lg:px-5 lg:py-4">
      <div className="lg:hidden">
        <SectionHeading>정류장 상세</SectionHeading>
      </div>
      <StationSummary station={station} />
      {updatedAt && (
        <span className="text-right text-xs text-slate-400">
          {formatUpdatedTime(updatedAt)} 기준
        </span>
      )}
    </section>
  )
}
