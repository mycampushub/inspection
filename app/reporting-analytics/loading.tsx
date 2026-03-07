import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SidebarInset } from "@/components/ui/sidebar"

export default function Loading() {
  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-40" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <div className="space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[300px]" />

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="p-4 pb-2">
                      <Skeleton className="h-5 w-[120px]" />
                    </CardHeader>
                    <CardContent className="p-4">
                      <Skeleton className="h-[150px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
