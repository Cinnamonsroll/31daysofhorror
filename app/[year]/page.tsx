import YearPage from "./YearPage";

export default async function PromiseYearPage({
  params,
}: {
  params: Promise<{
    year: string;
  }>;
}) {
  const { year } = await params;
  return <YearPage year={year}></YearPage>;
}
