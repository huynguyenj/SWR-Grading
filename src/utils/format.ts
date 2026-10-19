export function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatPoint = (n: number) => Number(n.toFixed(3)).toString()