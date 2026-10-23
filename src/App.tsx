import { lazy, Suspense, useEffect, useState } from 'react';
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
  const [smallScreenView, setSmallScreenView] = useState('Regular')
  const handleResize = () => {
    window.innerWidth < 768 ? setSmallScreenView('SmallScreen') : setSmallScreenView('Regular')
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="App flex flex-column col-12">
      {
        smallScreenView === 'Regular'
        ?
        <NavigationBar/>
        :
        <NavigationBarSmallScreen/>
      }

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
