import { formatDate } from "@/utils/format"
import type { GradingSessionType } from "../types/grading_session_monitor"
import Button from "@/components/ui/button"
import { FaEye } from "react-icons/fa"

interface MonitorGradingSessionTableProps {
    sessions?: GradingSessionType[]
    loading: boolean
    onViewAssignments: (session: GradingSessionType) => void
}

export default function MonitorGradingSessionTable({
    sessions,
    loading,
    onViewAssignments
}: MonitorGradingSessionTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border-default bg-bg-primary">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-bg-muted text-text-secondary">
                        <tr>
                            <th className="px-4 py-3 font-semibold">STT</th>
                            <th className="px-4 py-3 font-semibold">Tên phiên chấm</th>
                            <th className="px-4 py-3 font-semibold">Hạn chấm</th>
                            <th className="px-4 py-3 text-center font-semibold">
                                Tổng bài nộp
                            </th>
                            <th className="px-4 py-3 text-center font-semibold">
                                Đã phân công
                            </th>
                            <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                            <th className="px-4 py-3 text-center font-semibold">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-10 text-center text-text-muted"
                                >
                                    Đang tải danh sách phiên chấm...
                                </td>
                            </tr>
                        ) : !sessions || sessions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-10 text-center text-text-muted"
                                >
                                    Bạn chưa được phân công phiên chấm nào.
                                </td>
                            </tr>
                        ) : (
                            sessions.map((session, index) => (
                                <tr
                                    key={session.gradingSessionId}
                                    className="transition-colors hover:bg-bg-muted/50"
                                >
                                    <td className="px-4 py-3 text-text-secondary">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 font-medium text-text-primary">
                                        {session.title}
                                    </td>

                                    <td className="px-4 py-3 text-text-secondary">
                                        {formatDate(session.deadline)}
                                    </td>

                                    <td className="px-4 py-3 text-center text-text-primary">
                                        {session.numberSubmissions}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="font-medium text-text-primary">
                                            {session.assignedCount}
                                        </span>
                                        <span className="text-text-muted">
                                            {' '}/ {session.numberSubmissions}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-text-secondary">
                                        {formatDate(session.createdDate)}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <Button
                                            type="button"
                                            onClick={() => onViewAssignments(session)}
                                            variant='basic'
                                        >
                                            <FaEye className="w-4 h-4"/>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}