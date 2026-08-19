import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import About from './pages/About'
import LinkyLinkShortener from './pages/linky/LinkyLinkShortener';
import LinkyAccess from './pages/linky/LinkyAccess';
import LinkyList from './pages/linky/LinkyList';
import ExpenseLedger from './pages/expense/ExpenseLedger';
import FarmList from './pages/farm/FarmList';
import FarmAdd from './pages/farm/FarmAdd';
import FarmDetail from './pages/farm/FarmDetail';
import FarmEdit from './pages/farm/FarmEdit';
import AuthLogin from './pages/auth/AuthLogin';
import AuthRegister from './pages/auth/AuthRegister';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import Fishery from './pages/fishery/Fishery';
import FisheryCycleList from './pages/fishery/FisheryCycleList';
import FisheryCycleAdd from './pages/fishery/FisheryCycleAdd';
import FisheryCycleDetail from './pages/fishery/FisheryCycleDetail';
import FisheryFeedList from './pages/fishery/FisheryFeedList';
import FisheryFeedAdd from './pages/fishery/FisheryFeedAdd';
import FisheryFeedDetail from './pages/fishery/FisheryFeedDetail';
import FisheryPoolList from './pages/fishery/FisheryPoolList';
import FisheryPoolAdd from './pages/fishery/FisheryPoolAdd';
import FisheryPoolDetail from './pages/fishery/FisheryPoolDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/linky/shorten" element={<LinkyLinkShortener />} />
        <Route path="/linky/list" element={<LinkyList />} />
        <Route path="/ls/:shortCode" element={<LinkyAccess />} />
        <Route path="/expense-ledger" element={<ExpenseLedger />} />
        <Route path="/farm" element={<FarmList />} />
        <Route path="/farm/add" element={<FarmAdd />} />
        <Route path="/farm/edit/:id" element={<FarmEdit />} />
        <Route path="/farm/:id" element={<FarmDetail />} />
        <Route path="/fishery" element={<Fishery />} />
        <Route path="/fishery/pool" element={<FisheryPoolList />} />
        <Route path="/fishery/pool/add" element={<FisheryPoolAdd />} />
        <Route path="/fishery/pool/:id" element={<FisheryPoolDetail />} />
        <Route path="/fishery/feed" element={<FisheryFeedList />} />
        <Route path="/fishery/feed/add" element={<FisheryFeedAdd />} />
        <Route path="/fishery/feed/:id" element={<FisheryFeedDetail />} />
        <Route path="/fishery/cycle" element={<FisheryCycleList />} />
        <Route path="/fishery/cycle/add" element={<FisheryCycleAdd />} />
        <Route path="/fishery/cycle/:id" element={<FisheryCycleDetail />} />
        <Route path="/auth/login" element={<AuthLogin />} />
        <Route path="/auth/register" element={<AuthRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
