import { CardContent, Card as CardPrimitive } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CardSkeleton() {
  return (
    <CardPrimitive>
      <div className="flex items-start justify-between gap-2 px-4">
        <Skeleton className="h-[1.375rem] w-3/4" />
        <Skeleton className="h-5 w-16 shrink-0" />
      </div>

      <CardContent>
        <dl className="flex flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </dl>
      </CardContent>
    </CardPrimitive>
  )
}
