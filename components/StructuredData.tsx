'use client';

import Script from 'next/script';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
  };
}

export function OrganizationSchema({
  name = "Valory Line",
  url = "https://www.valoryline.com",
  logo = "https://www.valoryline.com/images/logo.png",
  description = "Valory Line, kadın ve erkek için özel tasarım lüks hediyelik eşya, takı, cüzdan, çanta ve aksesuar koleksiyonu sunar.",
  address = {
    streetAddress: "Abdi İpekçi Caddesi No: 42",
    addressLocality: "Nişantaşı, Şişli",
    addressRegion: "İstanbul",
    postalCode: "34367",
    addressCountry: "TR"
  },
  contactPoint = {
    telephone: "+90-212-123-4567",
    contactType: "customer service",
    areaServed: "TR",
    availableLanguage: "Turkish"
  }
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      ...address
    },
    contactPoint: {
      "@type": "ContactPoint",
      ...contactPoint
    },
    sameAs: [
      "https://www.facebook.com/valoryline",
      "https://www.instagram.com/valoryline",
      "https://www.pinterest.com/valoryline"
    ]
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteSchema({
  name = "Valory Line",
  url = "https://www.valoryline.com",
  description = "Valory Line - Lüks hediyelik eşya ve aksesuar mağazası"
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/magaza?arama={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    inLanguage: "tr-TR"
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = "TRY",
  availability = "https://schema.org/InStock",
  brand = "Valory Line",
  category
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `https://www.valoryline.com${image}`,
    brand: {
      "@type": "Brand",
      name: brand
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability,
      url: "https://www.valoryline.com/magaza"
    },
    ...(category && { category })
  };

  return (
    <Script
      id={`product-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
