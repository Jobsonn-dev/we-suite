import { SearchResult } from "@/lib/search/server";
import { CompanyResultCard } from "./company-result-card";
import { ProductResultCard } from "./product-result-card";
import { ServiceResultCard } from "./service-result-card";
import { IndustryResultCard } from "./industry-result-card";
import { TechnologyResultCard } from "./technology-result-card";
import { LocationResultCard } from "./location-result-card";

interface Props {
  result: SearchResult;
}

export function ResultCard({ result }: Props) {
  switch (result.type) {
    case "company":
      return <CompanyResultCard result={result} />;
    case "product":
      return <ProductResultCard result={result} />;
    case "service":
      return <ServiceResultCard result={result} />;
    case "industry":
      return <IndustryResultCard result={result} />;
    case "technology":
      return <TechnologyResultCard result={result} />;
    case "location":
      return <LocationResultCard result={result} />;
    default:
      return null;
  }
}
