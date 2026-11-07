import Modal from '@/components/ui/modal'
import Tabs from '@/components/ui/tabs'
import { useState } from 'react'
import type { ExaminationType } from '@/features/admin/management/examination/types/examination.type'
import UploadSingleMaterialSectionV2 from './UploadSingleMaterialSectionV2'
import UploadMultipleMaterialSectionV2 from './UploadMultipleMaterialsSectionV2'

export const DOCX_ACCEPT = '.docx'

interface UploadDocumentsModalProps {
  examination: ExaminationType | null
  isOpen: boolean
  onClose: () => void
  /** Gọi lại khi upload thành công — dùng để page refetch danh sách/đóng modal */
  onUploaded?: () => void
}

export default function UploadDocumentsModalV2({
  isOpen,
  onClose,
  onUploaded,
  examination
}: UploadDocumentsModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple'>('single')

  return (
    <Modal open={isOpen} onClose={onClose} title={examination?.examinationCode} maxWidth="xl">
      {examination && (
        <>
                <Tabs
                  tabs={[
                    { id: 'single', label: 'Upload đề thi' },
                    { id: 'multiple', label: 'Upload nhiều đề thi' },
                  ]}
                  activeTab={activeTab}
                  onChange={(id) => setActiveTab(id as 'single' | 'multiple')}
                />
                { activeTab === 'single' ?
                  <UploadSingleMaterialSectionV2
                    isSelected = {activeTab === 'single'}
                    onClose={onClose}
                    examination={examination}
                    onUploaded={onUploaded}
                  />
                  :
                  <UploadMultipleMaterialSectionV2
                    isSelected = {activeTab === 'multiple'}
                    onClose={onClose}
                    examination={examination}
                    onUploaded={onUploaded}
                  />
                }
        </>
      )}
    </Modal>
  )
}