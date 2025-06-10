"use client"

import * as React from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Item = Record<string, string>;

interface MultiSelectProps {
  items: Item[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  labelKey: string;
  valueKey: string;
}

function MultiSelect({
  items,
  selected,
  onSelectedChange,
  placeholder = "Select items",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  className,
  labelKey,
  valueKey,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onSelectedChange(selected.filter((item) => item !== value));
    } else {
      onSelectedChange([...selected, value]);
    }
    setQuery(""); // Clear search query on select/deselect
    inputRef.current?.focus();
  };

  // Filter out already selected items and apply search filter
  const filteredItems = items.filter((item) => {
    const isNotSelected = !selected.includes(item[valueKey]);
    const matchesSearch = item[labelKey].toLowerCase().includes(query.toLowerCase());
    return isNotSelected && matchesSearch;
  });

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={
              "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <span className="text-muted-foreground">{placeholder}</span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="end">
          <Command>
            <CommandPrimitive.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <CommandList>
              <CommandGroup>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <CommandItem
                      key={item[valueKey]}
                      value={item[valueKey]}
                      onSelect={() => handleSelect(item[valueKey])}
                    >
                      {item[labelKey]}
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-xs text-muted-foreground">{emptyText}</p>
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { MultiSelect }; 