"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, FileText, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchAll, SearchResults } from "@/lib/search-actions";

const EMPTY: SearchResults = { customers: [], projects: [], estimates: [] };

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length === 0) {
      setResults(EMPTY);
      return;
    }
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const data = await searchAll(query);
        setResults(data);
      });
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setResults(EMPTY);
    }
  };

  const go = (href: string) => {
    handleOpenChange(false);
    router.push(href);
  };

  const hasAnyResult =
    results.customers.length > 0 ||
    results.projects.length > 0 ||
    results.estimates.length > 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">横断検索</span>
        <kbd className="ml-1 hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="横断検索"
        description="案件・顧客・見積もりを横断して検索します"
      >
        <CommandInput
          placeholder="案件名・顧客名・コードなどで検索…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.trim().length === 0 ? (
            <CommandEmpty>案件・顧客・見積もりを横断して検索できます</CommandEmpty>
          ) : isPending ? (
            <CommandEmpty>検索中…</CommandEmpty>
          ) : !hasAnyResult ? (
            <CommandEmpty>該当する結果がありません</CommandEmpty>
          ) : (
            <>
              {results.projects.length > 0 && (
                <CommandGroup heading="案件">
                  {results.projects.map((r) => (
                    <CommandItem
                      key={`project-${r.id}`}
                      value={`project-${r.id}-${r.title}`}
                      onSelect={() => go(r.href)}
                    >
                      <Building2 className="text-muted-foreground" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{r.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {r.subtitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results.customers.length > 0 && (
                <CommandGroup heading="顧客">
                  {results.customers.map((r) => (
                    <CommandItem
                      key={`customer-${r.id}`}
                      value={`customer-${r.id}-${r.title}`}
                      onSelect={() => go(r.href)}
                    >
                      <Users className="text-muted-foreground" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{r.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {r.subtitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results.estimates.length > 0 && (
                <CommandGroup heading="見積もり">
                  {results.estimates.map((r) => (
                    <CommandItem
                      key={`estimate-${r.id}`}
                      value={`estimate-${r.id}-${r.title}`}
                      onSelect={() => go(r.href)}
                    >
                      <FileText className="text-muted-foreground" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{r.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {r.subtitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
