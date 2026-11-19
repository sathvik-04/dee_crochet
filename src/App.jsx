import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { products } from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collection from './components/Collection';
import CustomOrders from './components/CustomOrders';
import About from './components/About';
import InstagramBand from './components/InstagramBand';
import Footer from './components/Footer';
import SideYarnDecor from './components/SideYarnDecor';
import YarnCursor from './components/YarnCursor';
import LoadingScreen from './components/LoadingScreen';
import PicksTray from './components/PicksTray';

const AllProductsPage = lazy(() => import('./components/AllProductsPage'));

const STORAGE_KEY = 'deecrochet_picks';

const getPageFromPath = () =>
  window.location.pathname.replace(/\/+$/, '') === '/collection' ? 'collection' : 'home';

export default function App() {
  const [page, setPage] = useState(getPageFromPath);
  const [picks, setPicks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((id) => products.some((p) => p.id === id)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
    } catch {
      // Ignore storage quota / privacy errors
    }
  }, [picks]);

  // Sync with browser Back / Forward buttons
  useEffect(() => {
    const onPopState = () => {
      setPage(getPageFromPath());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((targetPage, sectionId) => {
    const nextPath = targetPage === 'collection' ? '/collection' : '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setPage(targetPage);

    if (targetPage === 'home' && sectionId) {
      // Wait a tick for home sections to mount if coming from /collection
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 20);
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const picksSet = useMemo(() => new Set(picks), [picks]);

  const pickedProducts = useMemo(
    () => picks.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [picks],
  );

  const togglePick = useCallback((id) => {
    setPicks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clearPicks = useCallback(() => {
    setPicks([]);
  }, []);

  return (
    <div className="relative">
      <LoadingScreen />
      <YarnCursor />
      <SideYarnDecor />
      <Navbar page={page} onNavigate={navigate} />

      <main className="pt-[74px]">
        {page === 'collection' ? (
          <Suspense fallback={<div className="min-h-[75vh]" />}>
            <AllProductsPage
              picksSet={picksSet}
              onTogglePick={togglePick}
              onBackHome={() => navigate('home')}
              onGoCustom={() => navigate('home', 'custom')}
            />
          </Suspense>
        ) : (
          <>
            <Hero />
            <Collection
              picksSet={picksSet}
              onTogglePick={togglePick}
              onSeeAll={() => navigate('collection')}
            />
            <CustomOrders />
            <About />
            <InstagramBand />
          </>
        )}
      </main>

      <Footer />

      <PicksTray
        pickedProducts={pickedProducts}
        onRemove={togglePick}
        onClear={clearPicks}
      />
    </div>
  );
}
