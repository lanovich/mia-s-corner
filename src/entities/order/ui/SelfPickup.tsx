import { cn } from "@/lib";
import React from "react";
import { Card, CardContent } from "@/shared/shadcn-ui/card";

interface Props {
  className?: string;
}

export const SelfPickup: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold pb-3">Самовывоз</h2>
      <Card className="flex space-y-2">
        <CardContent>
          <p className="mt-3">
            После оформления заказа мы вам позвоним, чтобы определить сроки
            выполнения заказа и уведомить об остальных деталях.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
