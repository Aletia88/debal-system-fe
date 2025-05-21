import { NavbarDemo } from "../components/header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import About from "./components/About"
import Testimonial from "./components/Testimonial"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <main>
      {/* <NavbarDemo /> */}
      <Hero />
      <Features />
      <About />
      <Testimonial />
      <Footer />
    </main>
  )
}
