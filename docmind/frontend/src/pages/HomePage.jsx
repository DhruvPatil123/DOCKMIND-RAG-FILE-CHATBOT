import LandingHero from "../components/LandingHero";
import FeatureSteps from "../components/FeatureSteps";

export default function HomePage({ onLaunch }) {
  return (
    <main className="px-6 pb-24 pt-6 lg:px-12">
      <LandingHero onLaunch={onLaunch} />
      <FeatureSteps />
    </main>
  );
}
