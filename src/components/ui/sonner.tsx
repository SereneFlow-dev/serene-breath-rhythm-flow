
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-white group-[.toast]:hover:bg-slate-800 dark:group-[.toast]:bg-indigo-600 dark:group-[.toast]:hover:bg-indigo-700",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-slate-900 group-[.toast]:hover:text-white dark:group-[.toast]:hover:bg-indigo-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
