import { useEffect } from 'react'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import CropCards from '../components/CropCards'
import HowItWorks from '../components/HowItWorks'
import DetectionDemo from '../components/DetectionDemo'
import Features from '../components/Features'
import AgricultureSection from '../components/AgricultureSection'
import CTA from '../components/CTA'
import './Home.css'

const Home = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <Stats />
      <CropCards />
      <HowItWorks />
      <DetectionDemo />
      <Features />
      <AgricultureSection />
      <CTA />
    </>
  )
}

export default Home
