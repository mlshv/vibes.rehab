import type { ReactNode, MouseEvent } from "react";
import { Button } from "@react95/core/Button";

type PromptTagProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const PromptTag = ({ children, onClick }: PromptTagProps) => {
  return (
    <Button onClick={onClick}>
      <span>{children}</span>
    </Button>
  );
};
