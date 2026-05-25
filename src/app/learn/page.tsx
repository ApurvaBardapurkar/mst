import { LearnExperience } from "@/components/learn/LearnExperience";
import { getCurriculum } from "@/lib/curriculum";

export default function LearnPage() {
  const curriculum = getCurriculum();
  return <LearnExperience curriculum={curriculum} />;
}
