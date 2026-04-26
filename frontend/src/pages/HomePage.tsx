import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import Jobs from "../components/home/Jobs";
import { jobs } from "../types/Job"
import How from "../components/home/How";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Jobs jobs={jobs}/>
      <How />
      <Footer />
    </>
  );
}

export default HomePage;
