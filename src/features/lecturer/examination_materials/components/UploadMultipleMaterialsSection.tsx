import { useEffect } from "react"
import { FiCalendar, FiPlus } from "react-icons/fi"
import SemesterStatusBadge from "@/features/admin/management/semester/components/SemesterBadge"
import type { SemesterType } from "@/features/admin/management/semester/types/semester"
import { formatDate } from "@/utils/format"
import useUploadMultipleExamMaterials from "../hooks/useUploadMultipleExamMaterials"
import MaterialFormItem from "./MaterialFormItem"
import Button from "@/components/ui/button"

interface UploadMultipleMaterialProps {
  semester: SemesterType
  isSelected: boolean
  onUploaded?: () => void
  onClose: () => void
}

export default function UploadMultipleMaterialSection({
  isSelected,
  semester,
  onUploaded,
  onClose,
}: UploadMultipleMaterialProps) {
  const {
    control,
    register,
    errors,
    reset,
    loading,
    onSubmit,

    materialFields,
    appendMaterial,
    removeMaterial,

    setMaterialQuestionFile,
    setMaterialRubricFile,
    setMaterialAnswerTemplateFile,
  } = useUploadMultipleExamMaterials()

  useEffect(() => {
    if (isSelected && semester) {
      reset({
        SemesterId: semester.semesterId,
        Materials: [
          {
            Description: "",
            Questions: [
              {
                title: "",
                content: "",
                point: "",
              },
            ],
            Question: undefined as unknown as File,
            AnswerRubric: undefined as unknown as File,
            AnswerTemplate: undefined as unknown as File,
          },
        ],
      })
    }
  }, [isSelected, semester, reset])

  async function handleFormSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()
    await onSubmit()
    onUploaded?.()
//     onClose()
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="px-5 py-4 space-y-5 max-h-[80vh] overflow-y-auto"
    >
      {/* Semester information */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md bg-bg-muted/50 px-4 py-3 text-sm text-text-secondary">
        <span className="flex items-center gap-1.5">
          <FiCalendar className="w-3.5 h-3.5 text-text-muted" />

          {formatDate(semester.startDate)}
          {" – "}
          {formatDate(semester.endDate)}
        </span>

        <SemesterStatusBadge status={semester.status} />
      </div>

      {/* Semester ID is not editable */}
      <input
        type="hidden"
        {...register("SemesterId")}
      />

      {/* Materials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Danh sách đề thi
            </h3>

            <p className="mt-0.5 text-xs text-text-muted">
              Bạn có thể upload nhiều đề thi cùng lúc
            </p>
          </div>

          <button
            type="button"
            onClick={appendMaterial}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-brand-orange hover:bg-brand-orange/10 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Thêm đề thi
          </button>
        </div>

        {errors.Materials?.message && (
          <p className="text-xs text-danger">
            {errors.Materials.message}
          </p>
        )}

        <div className="space-y-5">
          {materialFields.map((field, materialIndex) => (
            <MaterialFormItem
              key={field.id}
              control={control}
              register={register}
              errors={errors}
              materialIndex={materialIndex}
              canRemove={materialFields.length > 1}
              onRemove={() => removeMaterial(materialIndex)}
              setQuestionFile={setMaterialQuestionFile}
              setRubricFile={setMaterialRubricFile}
              setAnswerTemplateFile={setMaterialAnswerTemplateFile}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t border-border-default pt-4">
        <Button
          type="button"
          variant='basic'
          onClick={onClose}
          disabled={loading}
        >
          Hủy
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Đang tải lên..."
            : `Upload ${materialFields.length} bài thi`}
        </Button>
      </div>
    </form>
  )
}