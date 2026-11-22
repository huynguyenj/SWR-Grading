

import ManagerAiHumanScoreChart from './ManagerAiHumanScoreChart'
import ManagerAiHumanAccuracyCard from './ManagerAiHumanAccuracyCard'
import ManagerAiHumanAgreementChart from './ManagerAiHumanAgreementChart'
import type { ManagerAiHumanStatisticsType } from '../types/manager_dashboard'

interface ManagerAiHumanStatisticsSectionProps {
  data: ManagerAiHumanStatisticsType
}

export default function ManagerAiHumanStatisticsSection({
  data,
}: ManagerAiHumanStatisticsSectionProps) {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div>
        <h2 className="text-base font-semibold text-text-primary">
          So sánh hiệu quả chấm điểm AI và giảng viên
        </h2>

        <p className="mt-1 text-xs text-text-muted">
          Đánh giá mức độ tương đồng giữa kết quả chấm tự động
          và kết quả chấm của giảng viên.
        </p>
      </div>

      {/* Coverage */}
      <div className="rounded-lg border border-border-default bg-bg-primary p-4">
        <p className="text-xs text-text-muted">
          Số bài được cả AI và giảng viên chấm
        </p>

        <p className="mt-1 text-2xl font-semibold text-text-primary">
          {data.bothGradedCount.toLocaleString('vi-VN')}
        </p>

        <p className="mt-1 text-xs text-text-secondary">
          Trên tổng số {data.totalOfficialSubmissions.toLocaleString('vi-VN')} bài thi chính thức
        </p>
      </div>

      {/* Accuracy metrics */}
      <ManagerAiHumanAccuracyCard
        averageScoreDifference={data.averageScoreDifference}
        meanAbsoluteError={data.meanAbsoluteError}
        acceptableDeviationRate={data.acceptableDeviationRate}
      />

      {/* Comparison charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-lg border border-border-default bg-bg-primary p-5 xl:col-span-3">
          <h3 className="text-sm font-semibold text-text-primary">
            So sánh điểm số
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            Đối chiếu điểm trung bình, cao nhất và thấp nhất
            giữa AI và giảng viên.
          </p>

          <div className="mt-4">
            <ManagerAiHumanScoreChart
              humanAverageScore={data.humanAverageScore}
              humanHighestScore={data.humanHighestScore}
              humanLowestScore={data.humanLowestScore}
              aiAverageScore={data.aiAverageScore}
              aiHighestScore={data.aiHighestScore}
              aiLowestScore={data.aiLowestScore}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold text-text-primary">
            Mức độ chênh lệch kết quả
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            So sánh số bài có kết quả chấm cao hơn hoặc bằng nhau.
          </p>

          <div className="mt-4">
            <ManagerAiHumanAgreementChart
              aiHigherCount={data.aiHigherCount}
              humanHigherCount={data.humanHigherCount}
              equalCount={data.equalCount}
              bothGradedCount={data.bothGradedCount}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
