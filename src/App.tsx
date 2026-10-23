import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar/NavigationBar';
import NavigationBarSmallScreen from './components/NavigationBarSmallScreen/NavigationBarSmallScreen';
import Footer from './components/Footer/Footer';
import PageLoader from './components/PageLoader/PageLoader';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import './style/App.scss';

const HomePage = lazy(() => import('./pages/HomePage'));
const Page1 = lazy(() => import('./pages/Page1'));
const Page2 = lazy(() => import('./pages/Page2'));
const Animations = lazy(() => import('./pages/Animations'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="App flex flex-column col-12">
      {/* Both menus are rendered; CSS in App.scss shows one per screen size, so nothing jumps */}
      <div className="nav-desktop"><NavigationBar/></div>
      <div className="nav-mobile"><NavigationBarSmallScreen/></div>

      <ScrollToTop />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/carousels" element={<Page1 />} />
            <Route path="/page-2" element={<Page2 />} />
            <Route path="/animations" element={<Animations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer/>
    </div>
  )
}

export default App
