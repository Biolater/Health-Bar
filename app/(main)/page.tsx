import { Hero, News, Features, Community, ScrollToTop, Footer } from "@/components/index";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <News />
        <Features />
        <Community />
        <ScrollToTop  />
      </main>
      <Footer />
    </>
  );
}
