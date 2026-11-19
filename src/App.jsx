import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collection from './components/Collection';
import CustomOrders from './components/CustomOrders';
import About from './components/About';
import InstagramBand from './components/InstagramBand';
import Footer from './components/Footer';
import SideYarnDecor from './components/SideYarnDecor';
import YarnCursor from './components/YarnCursor';

export default function App() {
  return (
    <div className="relative">
      <YarnCursor />
      <SideYarnDecor />
      <Navbar />
      <main className="pt-[74px]">
        <Hero />
        <Collection />
        <CustomOrders />
        <About />
        <InstagramBand />
      </main>
      <Footer />
    </div>
  );
}
