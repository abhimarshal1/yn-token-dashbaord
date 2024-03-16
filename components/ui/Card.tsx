import { cn } from "@/utils/common";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: ClassValue;
}) => {
  return (
    <div
      className={cn("ring-2 ring-blue-500 rounded-md shadow-md p-4", className)}
    >
      {children}
    </div>
  );
};

export default Card;
