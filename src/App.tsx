import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ExploreScreen from './screens/ExploreScreen';
import FilterScreen from './screens/FilterScreen';
import DetailScreen from './screens/DetailScreen';
import BrewlogScreen from './screens/BrewlogScreen';
import AuthScreen from './screens/AuthScreen';
import AuthActionScreen from './screens/AuthActionScreen';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Browsing is open to everyone; accounts are needed only for personal features */}
        <Route path="/" element={<ExploreScreen />} />
        <Route path="/filter" element={<FilterScreen />} />
        <Route path="/brewlog" element={<BrewlogScreen />} />
        <Route path="/shop/:id" element={<DetailScreen />} />

        {/* Sign in / create account */}
        <Route path="/auth" element={<AuthScreen />} />
        {/* Landing page for links in confirmation / password-reset emails */}
        <Route path="/auth/action" element={<AuthActionScreen />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
