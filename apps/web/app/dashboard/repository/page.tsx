import { redirect } from "next/navigation";

export default function RepositoryDashboardRedirect() {
  redirect("/dashboard/admin/repository");
}
