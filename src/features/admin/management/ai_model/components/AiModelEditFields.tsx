import Pagination from '@/components/ui/pagination'

import useGetSupportedAiModels from '../hooks/useGetSupportedAiModels'

interface AiModelEditFieldsProps {
  name: string
  disabled?: boolean
  onChange: (value: string) => void
}

export default function AiModelEditFields({
  name,
  disabled = false,
  onChange,
}: AiModelEditFieldsProps) {
  const {
    data,
    supportedAiModels,
    loading,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = useGetSupportedAiModels({ enabled: true })

  const modelOptions = supportedAiModels.includes(name)
    ? supportedAiModels
    : name
      ? [name, ...supportedAiModels]
      : supportedAiModels

  return (
    <div className="min-w-56 space-y-2">
      <select
        value={name}
        disabled={disabled || loading}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-border-default bg-bg-primary px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="" disabled>
          {loading ? 'Loading supported models...' : 'Select a model'}
        </option>

        {modelOptions.map((modelName) => (
          <option key={modelName} value={modelName}>
            {modelName}
          </option>
        ))}
      </select>

      {!loading && supportedAiModels.length === 0 && (
        <p className="text-xs text-danger">
          No supported models found.
        </p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={data.totalPages}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}