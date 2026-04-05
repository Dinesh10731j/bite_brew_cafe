import { CreativeHero as Hero } from './sections/Hero'
import ErrorBoundary from './components/ErrorBoundary'
import { StorySection } from './sections/Story'
import { ExperienceSection } from './sections/Experience'
import CreativeTestimonials from './sections/Testimonials'
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

      {/* Story Section */}
      <ErrorBoundary>
        <StorySection />
      </ErrorBoundary>

      {/* Experience Section */}
      <ErrorBoundary>
        <ExperienceSection />
      </ErrorBoundary>

      {/* Testimonials Section */}
      <ErrorBoundary>
        <CreativeTestimonials
          title="Real Voices"
          subtitle="What our community says about the brew that bites back"
          testimonials={[
            {
              id: '1',
              name: 'Alex Rivera',
              role: 'Food Critic',
              quote: 'The perfect balance of bold coffee and savory bites. Bite & Brew redefined my morning ritual.',
              rating: 5,
              source: 'The Daily Brew'
            },
            {
              id: '2',
              name: 'Maya Chen',
              role: 'Tech Entrepreneur',
              quote: 'Energy in every sip, creativity in every bite. This is where ideas brew.',
              rating: 5,
              source: 'Startup Scene'
            },
            {
              id: '3',
              name: 'Jordan Hayes',
              role: 'Fitness Coach',
              quote: 'Clean ingredients, bold flavors. Fuel for champions who train hard and sip harder.',
              rating: 5
            },
            {
              id: '4',
              name: 'Sofia Patel',
              role: 'Graphic Designer',
              quote: 'The ambiance, the aroma, the art on the plate. Pure inspiration.',
              rating: 5
            }
          ]}
        />
      </ErrorBoundary>

 
      

     
    </div>
  )
}

