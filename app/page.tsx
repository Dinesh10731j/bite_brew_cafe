import Hero from './sections/Hero'
 import ErrorBoundary from './components/ErrorBoundary'

import CTA from './sections/CTA'
export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero 
        title="Bite & Brew"
        tagline="Where every sip tells a story"
        description="Premium café experience blending taste, ambiance, and culture"
        ctas={[
          { text: "Explore Menu", href: "#menu" },
          { text: "Visit Us", href: "#visit" }
        ]}
      />

      {/* CTA Section */}
      <ErrorBoundary>
        <CTA
          title="Experience the Perfect Brew"
          subtitle="Join us for an unforgettable journey through exceptional coffee, artisanal bites, and warm hospitality that feels like home."
          primaryCTA={{
            text: "Visit Us Today",
            href: "#visit"
          }}
          secondaryCTA={{
            text: "Order Online",
            href: "#order"
          }}
        />
      </ErrorBoundary>
    </div>
  )
}
