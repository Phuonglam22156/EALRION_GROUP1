import React from 'react';
import HeroSection from '../components/HeroSection';
import StorySection from '../components/StorySection';
import FactionCards from '../components/FactionCards';
import ItemsSection from '../components/ItemsSection';
import HowToPlay from '../components/HowToPlay';
import PricingSection from '../components/PricingSection';
import ReviewSection from '../components/ReviewSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StorySection />
      <FactionCards />
      <ItemsSection />
      <HowToPlay />
      <PricingSection />
      <ReviewSection />
      <Footer />
    </div>
  );
}
