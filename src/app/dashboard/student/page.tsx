import { getCurriculum } from "@/lib/curriculum";
import { StudentDashboardClient } from "@/components/dashboard/StudentDashboardClient";

export default function StudentDashboardPage() {
  const curriculum = getCurriculum();
  return <StudentDashboardClient curriculum={curriculum} />;
}
