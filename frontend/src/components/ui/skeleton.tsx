import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// BASE: Skeleton pulse primitive
// Usage: <Skeleton className="h-4 w-32" />
// ─────────────────────────────────────────────────────────────────────────────
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-700",
        className,
      )}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD SKELETON — generic property / listing card
// Usage: <CardSkeleton /> or <CardSkeleton count={6} />
// ─────────────────────────────────────────────────────────────────────────────
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden",
        className,
      )}
    >
      {/* Image placeholder */}
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Subtitle / location */}
        <Skeleton className="h-3 w-1/2" />
        {/* Price row */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeletonGrid({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE ROW SKELETON — admin listing / user tables
// Usage: <TableRowSkeleton /> or <TableRowSkeleton count={8} />
// ─────────────────────────────────────────────────────────────────────────────
export function TableRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-0",
        className,
      )}
    >
      {/* Avatar / thumbnail */}
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      {/* Text lines */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      {/* Badge */}
      <Skeleton className="hidden md:block h-5 w-16 rounded-full" />
      {/* Price */}
      <Skeleton className="hidden md:block h-4 w-20" />
      {/* Action buttons */}
      <div className="flex gap-2 shrink-0">
        <Skeleton className="w-8 h-8 rounded-xl" />
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD SKELETON — overview / dashboard stat boxes
// Usage: <StatCardSkeleton /> or <StatCardSkeletonGrid count={4} />
// ─────────────────────────────────────────────────────────────────────────────
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function StatCardSkeletonGrid({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST ITEM SKELETON — sidebar lists, inquiry lists, etc.
// Usage: <ListItemSkeleton /> or <ListSkeleton count={5} />
// ─────────────────────────────────────────────────────────────────────────────
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 py-3", className)}>
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-2/4" />
      </div>
      <Skeleton className="h-3.5 w-14 shrink-0" />
    </div>
  );
}

export function ListSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-slate-100 dark:divide-slate-800",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PAGE SKELETON — property detail / listing detail page
// Usage: <DetailPageSkeleton />
// ─────────────────────────────────────────────────────────────────────────────
export function DetailPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Hero image */}
      <Skeleton className="w-full h-72 md:h-96 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        {/* Sidebar */}
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE / USER CARD SKELETON
// Usage: <UserCardSkeleton />
// ─────────────────────────────────────────────────────────────────────────────
export function UserCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
        className,
      )}
    >
      <Skeleton className="w-11 h-11 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
      <Skeleton className="h-7 w-16 rounded-full" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO FILTER SKELETON — for search bars / filter strips
// Usage: <HeroFilterSkeleton />
// ─────────────────────────────────────────────────────────────────────────────
export function HeroFilterSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-4 items-end p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
        className,
      )}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-1 min-w-[120px] space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-10 w-24 rounded-lg shrink-0" />
    </div>
  );
}
