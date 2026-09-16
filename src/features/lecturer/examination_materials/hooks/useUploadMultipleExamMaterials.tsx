import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"
import { questionSchema } from "./useUploadExamMaterial"

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const examMaterialSchema = z.object({
      Description: z.string(),
      Questions: z.array(questionSchema).min(1, 'Phải có ít nhất 1 câu hỏi'),
      Question: z.instanceof(File, { error: 'File câu hỏi không được để trống' }).refine((file) => file.type === DOCX_MIME, 'File câu hỏi chỉ được upload dạng word'),
      AnswerRubric: z.instanceof(File, { error: 'File rubric không được để trống' }),
      AnswerTemplate: z.instanceof(File, { error: 'File answer không được để trống' }).refine((file) => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'File anser chỉ được upload dạng word'),
})

const multipleExamMaterialSchema = z.object({
  SemesterId: z.string().min(1, "Hãy chọn học kì phù hợp"),
  Materials: z.array(examMaterialSchema).min(1, "Phải có ít nhất 1 bài thi"),
})

export type MultipleExamMaterialFormType = z.infer<
  typeof multipleExamMaterialSchema
>

const emptyMaterial = {
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
}

export default function useUploadMultipleExamMaterials() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
  } = useForm<MultipleExamMaterialFormType>({
    resolver: zodResolver(multipleExamMaterialSchema),
    defaultValues: {
      SemesterId: "",
      Materials: [emptyMaterial],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Materials",
  })

  const { execute, loading } = useApiCall()

  const onSubmit = handleSubmit(async (values) => {
      console.log("SUBMIT VALUES:", values)
      const formData = new FormData()
      formData.append('SemesterId', values.SemesterId)
      values.Materials.forEach(
      (material, materialIndex) => {
            formData.append(
                  `Materials[${materialIndex}].Description`,
                  material.Description,
            )

            material.Questions.forEach(
                  (question, questionIndex) => {
                  formData.append(
                  `Materials[${materialIndex}].Questions[${questionIndex}].Title`,
                  question.title,
                  )

                  formData.append(
                  `Materials[${materialIndex}].Questions[${questionIndex}].Content`,
                  question.content,
                  )

                  formData.append(
                  `Materials[${materialIndex}].Questions[${questionIndex}].Point`,
                  question.point,
                  )
                  },
            )

            formData.append(
                  `Materials[${materialIndex}].Question`,
                  material.Question,
            )

            formData.append(
                  `Materials[${materialIndex}].AnswerRubric`,
                  material.AnswerRubric,
            )

            formData.append(
                  `Materials[${materialIndex}].AnswerTemplate`,
                  material.AnswerTemplate,
            )
      },
      )
      const response = await execute({
        apiUrl: "exam-materials/batch",
        method: "post",
        type: "private",
        body: formData,
      })

      if (response.error) {
        toast.error(response.error)
        return
      }
      toast.success(
        `Upload thành công ${values.Materials.length} bài thi`
      )
      reset()
    
  })

  return {
    control,
    register,
    errors,
    reset,
    watch,
    loading,
    onSubmit,
    materialFields: fields,
    appendMaterial: () => append(emptyMaterial),
    removeMaterial: remove,
    setMaterialQuestionFile: (
      index: number,
      file: File | null
    ) =>
      setValue(
        `Materials.${index}.Question`,
        file as File,
        {
          shouldValidate: true,
        }
      ),
    setMaterialRubricFile: (
      index: number,
      file: File | null
    ) =>
      setValue(
        `Materials.${index}.AnswerRubric`,
        file as File,
        {
          shouldValidate: true,
        }
      ),
    setMaterialAnswerTemplateFile: (
      index: number,
      file: File | null
    ) =>
      setValue(
        `Materials.${index}.AnswerTemplate`,
        file as File,
        {
          shouldValidate: true,
        }
      ),
  }
}