import {
  FiFileText,
  FiTrash2,
} from "react-icons/fi"
import {
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormReset,
} from "react-hook-form"
import Input from "@/components/ui/input"
import TextArea from "@/components/ui/textarea"
import SingleFileUploadField from "@/components/ui/SingleFileUpload"
import { DOCX_ACCEPT } from "./UploadDocumentModal"
import type { MultipleExamMaterialFormType } from "../hooks/useUploadMultipleExamMaterials"
import useReadFile from "../hooks/useReadFile"
import { useEffect } from "react"
import Button from "@/components/ui/button"

interface MaterialFormItemProps {
  control: Control<MultipleExamMaterialFormType>
  register: UseFormRegister<MultipleExamMaterialFormType>
  errors: FieldErrors<MultipleExamMaterialFormType>
  reset: UseFormReset<MultipleExamMaterialFormType>
  materialIndex: number
  canRemove: boolean
  onRemove: () => void
  setQuestionFile: (
    index: number,
    file: File | null,
  ) => void
  setRubricFile: (
    index: number,
    file: File | null,
  ) => void
  setAnswerTemplateFile: (
    index: number,
    file: File | null,
  ) => void
}

export default function MaterialFormItem({
  control,
  register,
  errors,
  materialIndex,
  canRemove,
  onRemove,
  setQuestionFile,
  setRubricFile,
  setAnswerTemplateFile,
}: MaterialFormItemProps) {
  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `Materials.${materialIndex}.Questions`,
  })
  const { handlePreviewFile, questionList } = useReadFile()
  const materialErrors = errors.Materials?.[materialIndex]
  const material = useWatch({
    control,
    name: `Materials.${materialIndex}`,
  })
  useEffect(() => {
    const updateQuestionField = () => {
      if (questionList.length === 0) return
      questionList.forEach((q) => {
        append({ title: q.title, content: q.content, point: String(q.point) })
      })
    }
    updateQuestionField()
  }, [questionList])
  return (
    <div
      className=" rounded-lg border border-border-default bg-bg-primary p-4 space-y-5"
    >
      {/* Material header */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange"
          >
            <FiFileText className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Đề thi {materialIndex + 1}
            </h3>

            <p className="text-xs text-text-muted">
              {questionFields.length} câu hỏi
            </p>
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-danger transition-colors"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            Xóa bài thi
          </button>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          Nội dung
        </label>

        <TextArea
          placeholder="VD: Đề thi bao gồm các câu hỏi về diagram và quy trình..."
          rows={3}
          {...register(`Materials.${materialIndex}.Description`)}
        />

        {materialErrors?.Description && (
          <p className="mt-1 text-xs text-danger">
            {materialErrors.Description.message}
          </p>
        )}
      </div>

      {/* Files */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-text-primary">
          Tài liệu bài thi
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
          <div className="flex items-start justify-between">
            <SingleFileUploadField
              label="File đề (.docx)"
              file={material.Question}
              onChange={(file) =>
                setQuestionFile(
                  materialIndex,
                  file,
                )
              }
              accept={DOCX_ACCEPT}
              error={
                materialErrors?.Question?.message
              }
            />
            <Button
              type="button"
              onClick={() => handlePreviewFile(material.Question)}
              disabled={material.Question == null}
            >
               Kiểm tra nội dung file
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            <SingleFileUploadField
              label="File rubric (.xlsx)"
              file={material.AnswerRubric}
              onChange={(file) =>
                setRubricFile(
                  materialIndex,
                  file,
                )
              }
              accept=".pdf,.doc,.docx,.xlsx"
              error={
                materialErrors?.AnswerRubric?.message
              }
            />
            <SingleFileUploadField
              label="File đáp án (.docx)"
              file={material.AnswerTemplate}
              onChange={(file) =>
                setAnswerTemplateFile(
                  materialIndex,
                  file,
                )
              }
              accept={DOCX_ACCEPT}
              error={
                materialErrors?.AnswerTemplate?.message
              }
            />

          </div>
        </div>
      </div>
      { questionList.length > 0 && 
        <>
      {/* Questions */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">
              Danh sách câu hỏi
            </h4>

            {materialErrors?.Questions?.message && (
              <p className="mt-1 text-xs text-danger">
                {materialErrors.Questions.message}
              </p>
            )}
          </div>

          {/* <button
            type="button"
            onClick={() =>
              append({
                title: "",
                content: "",
                point: "",
              })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:text-brand-rust transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Thêm câu hỏi
          </button> */}
        </div>

        <div className="space-y-3">
          {questionFields.map(
            (field, questionIndex) => {
              const questionErrors =
                materialErrors?.Questions?.[
                  questionIndex
                ]
              return (
                <div
                  key={field.id}
                  className="rounded-md border border-border-default p-3 space-y-2.5"
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted">
                      Câu hỏi {questionIndex + 1}
                    </span>

                    {questionFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          remove(questionIndex)
                        }
                        className="text-text-muted hover:text-danger transition-colors"
                        aria-label={`Xóa câu hỏi ${
                          questionIndex + 1
                        }`}
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <Input
                    size="basic"
                    placeholder="Tiêu đề câu hỏi"
                    {...register(`Materials.${materialIndex}.Questions.${questionIndex}.title`)}
                    error={questionErrors?.title?.message}
                  />

                  {/* Content */}
                  <TextArea
                    placeholder="Nội dung câu hỏi"
                    rows={2}
                    {...register(`Materials.${materialIndex}.Questions.${questionIndex}.content`)}
                  />

                  {questionErrors?.content && (
                    <p className="mt-1 text-xs text-danger">
                      {questionErrors.content.message}
                    </p>
                  )}

                  {/* Point */}
                  <div className="w-32">
                    <Input
                      size="basic"
                      placeholder="Điểm"
                      {...register(`Materials.${materialIndex}.Questions.${questionIndex}.point`)}
                      error={questionErrors?.point?.message}
                    />
                  </div>
                </div>
              )
            },
          )}
        </div>
      </div>
        </>
      }
    </div>
  )
}