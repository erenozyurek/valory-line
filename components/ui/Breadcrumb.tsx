'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
            aria-label="Ana Sayfa"
          >
            <Home size={16} />
            <span className="sr-only">Ana Sayfa</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.url}>
              <li>
                <ChevronRight size={16} className="text-[#71717A]" />
              </li>
              <li>
                {isLast ? (
                  <span 
                    className="text-[#D4AF37]"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
