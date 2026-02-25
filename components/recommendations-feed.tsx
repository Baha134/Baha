"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { BadgeCheck, MessageSquareText, Quote } from "lucide-react"
import { recommendationsData } from "@/data"

export function RecommendationsFeed() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-primary" />
            Professor Recommendations
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {recommendationsData.length} reviews
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-5">
        {recommendationsData.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
          >
            {/* Professor info */}
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {rec.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold text-foreground">
                    {rec.professorName}
                  </p>
                  {rec.verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {rec.department}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {rec.date}
              </span>
            </div>

            {/* Review text */}
            <div className="relative pl-4">
              <Quote className="absolute left-0 top-0 h-3 w-3 text-primary/40" />
              <p className="text-[13px] leading-relaxed text-foreground/80">
                {rec.text}
              </p>
            </div>

            {/* Course tag */}
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {rec.course}
              </span>
              {rec.verified && (
                <span className="flex items-center gap-1 text-[10px] text-chart-3">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
