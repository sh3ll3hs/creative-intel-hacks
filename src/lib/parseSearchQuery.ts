import type { Person } from "@/types/shared";

export function parseSearchQuery(query: string, allPeople: Person[]): Person[] {
  const lowerQuery = query.toLowerCase();

  // Extract filters from the query
  let ageMin: number | null = null;
  let ageMax: number | null = null;
  let gender: string | null = null;
  let generation: string | null = null;
  let location: string | null = null;
  let industry: string | null = null;

  // Age range patterns
  const ageRangeMatch = lowerQuery.match(
    /age\s+(?:range\s+)?(?:around\s+|between\s+)?(\d+)[-–\s]*(?:to\s+)?(\d+)/
  );
  if (ageRangeMatch) {
    ageMin = parseInt(ageRangeMatch[1]);
    ageMax = parseInt(ageRangeMatch[2]);
  } else {
    const singleAgeMatch = lowerQuery.match(/age\s+(?:around\s+|about\s+)?(\d+)/);
    if (singleAgeMatch) {
      const age = parseInt(singleAgeMatch[1]);
      ageMin = age - 2;
      ageMax = age + 2;
    }
  }

  // Gender patterns
  if (lowerQuery.includes("women") || lowerQuery.includes("female")) {
    gender = "Women";
  } else if (lowerQuery.includes("men") || lowerQuery.includes("male")) {
    gender = "Men";
  }

  // Generation patterns
  if (lowerQuery.includes("gen z") || lowerQuery.includes("generation z")) {
    generation = "Gen Z";
  } else if (lowerQuery.includes("millennial") || lowerQuery.includes("gen y")) {
    generation = "Millennial";
  } else if (lowerQuery.includes("gen x") || lowerQuery.includes("generation x")) {
    generation = "Gen X";
  }

  // Location patterns
  const canadianCities = [
    "toronto", "vancouver", "montreal", "calgary", "ottawa",
    "edmonton", "winnipeg", "quebec", "hamilton", "kitchener",
    "london", "halifax",
  ];
  const canadianProvinces = [
    "ontario", "quebec", "british columbia", "alberta",
    "manitoba", "saskatchewan", "nova scotia", "new brunswick",
    "newfoundland", "prince edward island",
  ];

  for (const city of canadianCities) {
    if (lowerQuery.includes(city)) {
      location = city;
      break;
    }
  }

  if (!location) {
    for (const province of canadianProvinces) {
      if (lowerQuery.includes(province)) {
        location = province;
        break;
      }
    }
  }

  if (lowerQuery.includes("canada") || lowerQuery.includes("canadian")) {
    location = location || "canada";
  }

  // Industry patterns
  const industries = [
    "fintech", "finance", "technology", "tech",
    "software", "marketing", "design", "operations",
  ];
  for (const ind of industries) {
    if (lowerQuery.includes(ind)) {
      industry = ind;
      break;
    }
  }

  // Filter people based on extracted criteria
  return allPeople.filter((person) => {
    let matches = true;

    if (ageMin !== null && ageMax !== null) {
      matches = matches && person.age >= ageMin && person.age <= ageMax;
    }

    if (gender) {
      matches = matches && person.gender.toLowerCase() === gender.toLowerCase();
    }

    if (generation) {
      matches = matches && person.generation.toLowerCase() === generation.toLowerCase();
    }

    if (location && location !== "canada") {
      matches = matches && person.location.toLowerCase().includes(location.toLowerCase());
    }

    if (industry) {
      matches = matches && person.industry.toLowerCase().includes(industry.toLowerCase());
    }

    return matches;
  });
}
