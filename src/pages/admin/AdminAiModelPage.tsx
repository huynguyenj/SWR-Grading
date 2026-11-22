import { useState } from 'react'
import {
  FiCpu,
  FiPlus,
  FiRefreshCw,
  FiCheckCircle,
  FiKey,
  FiStar,
} from 'react-icons/fi'

import Button from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import useGetAiModels from '@/features/admin/management/ai_model/hooks/useGetAiModels'
import AiModelTable from '@/features/admin/management/ai_model/components/AiModelTable'
import CreateAiModelModal from '@/features/admin/management/ai_model/components/CreateAiModelModal'


export default function AdminAiModelPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    data,
    loading,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  } = useGetAiModels()

  const items = data?.items ?? []

  const totalModels = data?.totalCount ?? 0
  const activeModels = items.filter((model) => model.status).length
  const configuredModels = items.filter((model) => model.hasApiKey).length
  const selectedModels = items.filter((model) => model.isSelected).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiCpu className="text-brand-orange" size={22} />
            <h1 className="text-xl font-semibold text-text-primary">
              Quản lí AI Model
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Quản lí AI model, api key, chi phí
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="basic"
            size="basic"
            onClick={refresh}
            disabled={loading}
          >
            <FiRefreshCw
              size={15}
              className={loading ? 'animate-spin' : ''}
            />
            <span className="ml-2">Làm mới</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="basic"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FiPlus size={16} />
            <span className="ml-2">Thêm AI model</span>
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Tổng AI model</p>
            <FiCpu className="text-brand-orange" size={18} />
          </div>

          <p className="mt-2 text-2xl font-semibold text-text-primary tabular-nums">
            {totalModels}
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">AI model hoạt động</p>
            <FiCheckCircle className="text-success" size={18} />
          </div>

          <p className="mt-2 text-2xl font-semibold text-text-primary tabular-nums">
            {activeModels}
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">API Keys</p>
            <FiKey className="text-brand-orange" size={18} />
          </div>

          <p className="mt-2 text-2xl font-semibold text-text-primary tabular-nums">
            {configuredModels}
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">AI model đang được sử dụng</p>
            <FiStar className="text-warning" size={18} />
          </div>

          <p className="mt-2 text-2xl font-semibold text-text-primary tabular-nums">
            {selectedModels}
          </p>
        </div>
      </div>

      {/* Table section */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              AI Models
            </h2>

            <p className="text-sm text-text-secondary">
              {totalModels} model{totalModels === 1 ? '' : 's'} in total
            </p>
          </div>
        </div>

       <AiModelTable
        items={items}
        loading={loading}
        onRefresh={refresh}
       />

        {data && data.totalPages > 0 && (
          <Pagination
            currentPage={page}
            onPageChange={handlePageChange}
            totalPages={data.totalPages}
            onPageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        )}
      </section>

      {/* Create modal */}
      <CreateAiModelModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRefresh={refresh}
      />
    </div>
  )
}