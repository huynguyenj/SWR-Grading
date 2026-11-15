
import { apiPrivate } from "@/config/axiox.config"
import { useCallback, useEffect, useState } from "react"

export default function useGetAnswerImage() {
    const [image, setImage] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const handleGetImage = useCallback(async (parseAnswerId: string) => {
        try {
            setLoading(true)

            const response: Blob = await apiPrivate.get(
                `/submission-parsed-answers/${parseAnswerId}/image`,
                {
                    responseType: "blob",
                },
            )

            const imageUrl = URL.createObjectURL(response)

            setImage((previousImage) => {
                if (previousImage) {
                    URL.revokeObjectURL(previousImage)
                }

                return imageUrl
            })
        } catch (error) {
            console.error("Failed to get answer image:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [])

    const clearImage = useCallback(() => {
        setImage((previousImage) => {
            if (previousImage) {
                URL.revokeObjectURL(previousImage)
            }

            return ""
        })
    }, [])

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image)
            }
        }
    }, [image])

    return {
        image,
        loading,
        handleGetImage,
        clearImage,
    }
}
