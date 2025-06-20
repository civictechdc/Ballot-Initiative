import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/hooks/axios'
import { toast } from 'sonner'

interface UploadFileProps {
    file: File
    filetype: string
}

export const useUploadFile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ file, filetype }: UploadFileProps) => {
            const formData = new FormData()
            formData.append('file', file)
            console.log(`Uploading file: ${file.name} of type ${filetype}`)
            const response = await axios.post(`/upload/${filetype}`, formData)
            if (response.status !== 200) {
                toast.error(response.data?.message || 'File upload failed')
            }
            else {
                toast.success(response.data?.message || 'File uploaded successfully')
            }
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["voter-records"] })
        }
    })
}