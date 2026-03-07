import { useAppStore } from './store'

export function useToast() {
  const { addNotification, notifications, removeNotification } = useAppStore()

  const toast = ({
    title,
    description,
    variant = 'default',
  }: {
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success' | 'warning'
  }) => {
    const type = variant === 'destructive' ? 'error' : (variant as 'success' | 'warning' | 'info')
    addNotification({
      type,
      title,
      message: description || '',
    })
  }

  return {
    toast,
    notifications,
    dismiss: removeNotification,
  }
}
