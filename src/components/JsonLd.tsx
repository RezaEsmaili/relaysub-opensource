/**
 * JSON-LD structured data helpers.
 *
 * These emit schema.org metadata that search engines (Google, Bing → DuckDuckGo)
 * use to understand the brand "R22E Studio" and each app as a product. This is
 * what powers rich brand results when someone searches "r22e", "gelim",
 * "relaysub", or "relay download manager".
 */

const BASE_URL = "https://r22e.com";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static and trusted (built from our own constants).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization schema for the whole site. Render once, on the homepage. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "R22E Studio",
        alternateName: "R22E",
        url: BASE_URL,
        logo: `${BASE_URL}/logo-icon.png`,
        description:
          "R22E Studio is a creative technology studio building apps like Gelim, RelaySub, and RDM (Relay Download Manager).",
        sameAs: [
          "https://x.com/r22e_studio",
          "https://instagram.com/r22e.studio",
          "https://github.com/r22e",
        ],
      }}
    />
  );
}

interface AppSchema {
  name: string;
  description: string;
  path: string;
  operatingSystem: string;
  category?: string;
  price?: string;
}

/** SoftwareApplication schema for a single app page. */
export function SoftwareApplicationJsonLd({
  name,
  description,
  path,
  operatingSystem,
  category = "UtilitiesApplication",
  price = "0",
}: AppSchema) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        url: `${BASE_URL}${path}`,
        applicationCategory: category,
        operatingSystem,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "R22E Studio",
          url: BASE_URL,
        },
      }}
    />
  );
}
