import BusFareCalculator from "./components/BusFareCalculator";
import { AboutBusService } from "./components/AboutBusService";
import { Faq } from "./components/Faq";
import { ROUTE_LIST } from "./lib/routes";
import { FAQS, SEO_DESCRIPTION, SEO_TITLE, SITE_NAME, SITE_URL } from "./lib/seo";
import { FARE_PER_TRIP, SEMESTER_LABEL } from "./lib/semester";

/* Regenerated at most hourly, so the ticket sale band ships in the state
   that matches the current time (open, closed, collapsed) instead of
   jumping after load. */
export const revalidate = 3600;

const url = (path = "/") => new URL(path, SITE_URL).toString();

/* Structured data, in the server-rendered HTML so crawlers do not have to
   run JavaScript to find it. One @graph ties the site, the tool, the
   university it is about and the FAQ together by @id. */
function structuredData(modified: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": url("/#website"),
        url: url(),
        name: SITE_NAME,
        alternateName: ["NSU Student Bus Fare Calculator", "NSU Bus Fare"],
        description: SEO_DESCRIPTION,
        inLanguage: "en",
        about: { "@id": url("/#nsu") },
      },
      {
        "@type": "CollegeOrUniversity",
        "@id": url("/#nsu"),
        name: "North South University",
        alternateName: "NSU",
        url: "https://www.northsouth.edu/",
        sameAs: ["https://en.wikipedia.org/wiki/North_South_University"],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bashundhara R/A",
          addressLocality: "Dhaka",
          addressCountry: "BD",
        },
      },
      {
        "@type": "WebApplication",
        "@id": url("/#app"),
        name: "NSU Student Bus Fare Calculator",
        url: url(),
        description: `Works out the ${SEMESTER_LABEL} North South University student bus fare for the days you travel, with pickup points and trip times for all ${ROUTE_LIST.length} routes.`,
        applicationCategory: "TravelApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Works in any modern browser.",
        inLanguage: "en",
        isAccessibleForFree: true,
        image: url("/opengraph-image.jpg"),
        screenshot: url("/opengraph-image.jpg"),
        offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
        featureList: [
          "Semester fare for round trip, one way and pay per ticket",
          "Expected refund for days the service is suspended",
          "Live countdowns for the round trip and one way ticket sales",
          `Pickup points and trip times for ${ROUTE_LIST.map((r) => r.label).join(", ")}`,
          `Fares: Tk ${FARE_PER_TRIP} one way, Tk ${FARE_PER_TRIP * 2} round trip`,
        ],
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        about: { "@id": url("/#nsu") },
        isPartOf: { "@id": url("/#website") },
      },
      {
        "@type": "FAQPage",
        "@id": url("/#faq"),
        url: url(),
        name: SEO_TITLE,
        inLanguage: "en",
        dateModified: modified,
        isPartOf: { "@id": url("/#website") },
        mainEntity: FAQS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export default function Home() {
  /* A Server Component that runs once per hourly regeneration, so reading
     the clock here is the point: it stamps when this HTML was built. */
  // eslint-disable-next-line react-hooks/purity
  const renderedAt = Date.now();
  const json = JSON.stringify(structuredData(new Date(renderedAt).toISOString()));

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script element early.
        dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
      />
      <BusFareCalculator renderedAt={renderedAt} about={<AboutBusService />} faq={<Faq />} />
    </>
  );
}
