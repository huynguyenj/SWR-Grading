 export const getStatusLabel = (status: number): string => {
        switch (status) {
            case 0:
                return "Pending"
            case 1:
                return "Completed"
            case 2:
                return "Failed"
            default:
                return "Unknown"
        }
    }

export const getStatusClass = (status: number): string => {
        switch (status) {
            case 0:
                return "bg-yellow-100 text-yellow-700"
            case 1:
                return "bg-green-100 text-green-700"
            case 2:
                return "bg-red-100 text-red-700"
            default:
                return "bg-bg-muted text-text-secondary"
        }
    }