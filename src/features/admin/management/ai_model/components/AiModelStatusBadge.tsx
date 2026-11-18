import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

interface AiModelStatusBadgeProps {
  active: boolean
}

export default function AiModelStatusBadge({
  active,
}: AiModelStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? 'bg-success/10 text-success'
          : 'bg-danger/10 text-danger'
      }`}
    >
      {active ? <FiCheckCircle size={13} /> : <FiXCircle size={13} />}
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}