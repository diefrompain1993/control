"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DropdownProps = {
  caption?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  className?: string;
  name?: string;
  "aria-label"?: string;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const Dropdown = ({
    caption,
    value,
    onChange,
    children,
    className: dropdownClassName
  }: DropdownProps) => {
    const [open, setOpen] = React.useState(false);
    const options = React.Children.toArray(children).filter(React.isValidElement);

    const handleSelect = (nextValue: string) => {
      if (onChange) {
        onChange({ target: { value: nextValue } } as React.ChangeEvent<HTMLSelectElement>);
      }
      setOpen(false);
    };

    return (
      <div className={cn("relative", dropdownClassName)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            >
              <span className="truncate">{caption}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={6}
            className="w-40 p-1 rounded-md border border-slate-200 bg-white shadow-lg"
          >
            <div className="max-h-56 overflow-y-auto py-1">
              {options.map((option) => {
                if (!React.isValidElement(option)) return null;
                const optionValue = String(option.props.value);
                const isSelected = String(value) === optionValue;
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => handleSelect(optionValue)}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {option.props.children}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        caption_dropdowns: "flex items-center justify-center gap-2",
        dropdown_month: "min-w-[140px]",
        dropdown_year: "min-w-[96px]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
        Dropdown,
      }}
      {...props}
    />
  );
}

export { Calendar };
