import { examRuleOptions, type ExamRuleKey } from "../types/examination.type"

interface ExamRulesSectionProps {
  selectedRules: ExamRuleKey[]
  onToggleRule: (key: ExamRuleKey) => void
  notes: string
  onNotesChange: (v: string) => void
}

export default function ExamRulesSection({
  selectedRules,
  onToggleRule,
  notes,
  onNotesChange,
}: ExamRulesSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {examRuleOptions.map((rule) => (
          <label
            key={rule.key}
            className="flex items-center gap-2.5 rounded-md border border-border-default px-3 py-2.5 cursor-pointer hover:bg-bg-muted/40 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedRules.includes(rule.key)}
              onChange={() => onToggleRule(rule.key)}
              className="w-4 h-4 rounded border-border-default text-brand-orange focus:ring-brand-orange/30"
            />
            <span className="text-sm text-text-primary">{rule.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Quy định / ghi chú thêm
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="VD: Thí sinh cần có mặt trước 15 phút, mang theo thẻ sinh viên..."
          className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
        />
      </div>
    </div>
  )
}