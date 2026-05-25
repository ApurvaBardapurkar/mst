import type { Metadata } from "next";
import { getCurriculum } from "@/lib/curriculum";
import { LearnExperience } from "@/components/learn/LearnExperience";

export const metadata: Metadata = {
  title: "Learning Tree — Interactive Blockchain Curriculum",
  description:
    "Navigate 21 modules across 4 phases in an interactive learning tree. Master blockchain development from fundamentals to funded founder.",
};

export default function LearnPage() {
  const curriculum = getCurriculum();
  return <LearnExperience curriculum={curriculum} />;
}
