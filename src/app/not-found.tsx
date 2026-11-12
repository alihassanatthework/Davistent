import { CampCards } from "@/components/home/CampCards";
import { ButtonLink, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section className="pt-32">
      <h1>We couldn’t find that page</h1>
      <p className="mb-8 mt-4">It may have moved in our redesign. Try one of these, or search from the top of the page.</p>
      <CampCards />
      <ButtonLink href="/tents/" className="mt-8">Go to tents</ButtonLink>
    </Section>
  );
}
