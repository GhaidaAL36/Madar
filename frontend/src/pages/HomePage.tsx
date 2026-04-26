import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import Jobs from "../components/home/Jobs";
import How from "../components/home/How";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Jobs />
      <How />
      <Footer />
    </>
  );
}

export default HomePage;
