import { ROUTE_PROGRESS_LABEL_WIDTH } from '../utils/routeProgress';
import { BusIcon } from './ui/BusIcon';

export type RouteProgressNode = {
  index: number;
  position: number;
  name: string | null;
  isTarget: boolean;
  isCurrent: boolean;
  isPassed: boolean;
};

type RouteProgressTrackProps = {
  accentColor: string;
  busPosition: number | null;
  traveledWidth: number;
  nodes: RouteProgressNode[];
};

type FallbackStationLabelsProps = {
  current: { name: string; position: number; alignLeft: boolean } | null;
  destination: string | null;
};

function StationNode({ node, accentColor }: { node: RouteProgressNode; accentColor: string }) {
  const isHighlighted = node.isCurrent || node.isTarget;
  const dotSizeClass = node.isTarget ? 'size-4 border-[3px]' : 'size-3 border-2';
  const dotColor = node.isPassed || node.isTarget ? accentColor : '#94A3B8';

  return (
    <span
      className="absolute top-8 -translate-x-1/2"
      style={{
        left: `${node.position}%`,
        width: `${ROUTE_PROGRESS_LABEL_WIDTH}%`,
      }}
    >
      <span
        className={`${dotSizeClass} absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white`}
        style={{ borderColor: dotColor }}
      />
      {node.name && (
        <span
          className="absolute top-2 line-clamp-2 w-full text-center text-[10px] leading-3 text-slate-500"
          style={{
            color: isHighlighted ? accentColor : undefined,
            fontWeight: isHighlighted ? 700 : 500,
          }}
          title={node.name}
        >
          {node.name}
        </span>
      )}
    </span>
  );
}

function BusMarker({ position, color }: { position: number; color: string }) {
  return (
    <span className="absolute top-0 -translate-x-1/2" style={{ left: `${position}%` }}>
      <span
        className="grid h-7 w-8 place-items-center rounded-md border-2 border-white text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        <BusIcon className="h-5 w-6 stroke-[1.8]" />
      </span>
    </span>
  );
}

export function RouteProgressTrack({
  accentColor,
  busPosition,
  traveledWidth,
  nodes,
}: RouteProgressTrackProps) {
  return (
    <>
      <span className="absolute top-8 right-[6%] left-[6%] h-0.5 bg-slate-300" />
      {traveledWidth > 0 && (
        <span
          className="absolute top-8 left-[6%] h-0.5"
          style={{ width: `${traveledWidth}%`, backgroundColor: accentColor }}
        />
      )}

      {nodes.map((node) => (
        <StationNode key={node.index} node={node} accentColor={accentColor} />
      ))}

      {busPosition !== null && <BusMarker position={busPosition} color={accentColor} />}
    </>
  );
}

export function FallbackStationLabels({ current, destination }: FallbackStationLabelsProps) {
  return (
    <>
      {current && (
        <span
          className={`absolute top-10 max-w-[24%] truncate text-[11px] font-medium text-slate-600 ${current.alignLeft ? 'text-left' : '-translate-x-1/2 text-center'}`}
          style={{ left: `${current.position}%` }}
          title={current.name}
        >
          {current.name}
        </span>
      )}
      {destination && (
        <span
          className="absolute top-10 right-0 max-w-[24%] truncate text-right text-[11px] font-semibold text-slate-700"
          title={destination}
        >
          {destination}
        </span>
      )}
    </>
  );
}
