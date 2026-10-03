import { SearchResult } from "@/lib/search/server";
import { CompanyResultCard } from "./company-result-card";
import { ProductResultCard } from "./product-result-card";
import { ServiceResultCard } from "./service-result-card";
import { IndustryResultCard } from "./industry-result-card";
import { TechnologyResultCard } from "./technology-result-card";
import { LocationResultCard } from "./location-result-card";

interface Props {
  result: SearchResult;
  query?: string;
}

export function ResultCard({ result, query }: Props) {
  switch (result.type) {
    case "company":
      return <CompanyResultCard result={result} query={query} />;
    case "product":
      return <ProductResultCard result={result} query={query} />;
    case "service":
      return <ServiceResultCard result={result} query={query} />;
    case "industry":
      return <IndustryResultCard result={result} query={query} />;
    case "technology":
      return <TechnologyResultCard result={result} query={query} />;
    case "location":
      return <LocationResultCard result={result} query={query} />;
    default:
      return null;
  }
}
