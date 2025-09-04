import React from "react";
import { Button } from "@/shared/shadcn-ui";
import { LogIn } from "lucide-react";

interface Props {
  className?: string;
}

export const LogInButton: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Button>
        Войти <LogIn />
      </Button>
    </div>
  );
};
