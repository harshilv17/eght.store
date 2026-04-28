interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="flex flex-col border-t border-[var(--color-outline-variant)]">
      {items.map((item) => (
        <details key={item.title} className="group border-b border-[var(--color-outline-variant)] py-4 cursor-pointer">
          <summary className="flex justify-between items-center text-label-caps text-[var(--color-primary)] list-none select-none">
            {item.title}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-200 group-open:rotate-180"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <p className="pt-4 text-body-md text-[var(--color-on-surface-variant)]">{item.content}</p>
        </details>
      ))}
    </div>
  );
}
