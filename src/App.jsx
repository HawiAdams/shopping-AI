import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import ProductAnalysis from './pages/ProductAnalysis';
import Subscription from './pages/Subscription';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/analysis/:productId" element={<ProductAnalysis />} />
              <Route path="/subscription" element={<Subscription />} />
            </Routes>
          </main>
          <Toaster position="bottom-right" />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}