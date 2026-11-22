import type { ManagerScoreDistributionBucketType } from "../types/manager_dashboard"


interface ManagerScoreDistributionLegendProps {
  data: ManagerScoreDistributionBucketType[]
}

export default function ManagerScoreDistributionLegend({
  data,
}: ManagerScoreDistributionLegendProps) {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-orange" />
          <span className="text-xs text-text-secondary">
            AI chấm
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-wine" />
          <span className="text-xs text-text-secondary">
            Giảng viên chấm
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-border-default text-xs text-text-muted">
              <th className="py-2 text-left font-medium">
                Khoảng điểm
              </th>
              <th className="py-2 text-right font-medium">
                AI
              </th>
              <th className="py-2 text-right font-medium">
                Giảng viên
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.label}
                className="border-b border-border-default last:border-0"
              >
                <td className="py-2.5 font-medium text-text-primary">
                  {item.label}
                </td>

                <td className="py-2.5 text-right">
                  <span className="font-medium text-brand-orange">
                    {item.aiCount}
                  </span>
                  <span className="ml-1 text-xs text-text-muted">
                    ({item.aiPercentage}%)
                  </span>
                </td>

                <td className="py-2.5 text-right">
                  <span className="font-medium text-brand-wine">
                    {item.humanCount}
                  </span>
                  <span className="ml-1 text-xs text-text-muted">
                    ({item.humanPercentage}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
