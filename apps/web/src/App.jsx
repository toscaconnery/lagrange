import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import About from './pages/About'
import LinkyLinkShortener from './pages/linky/LinkyLinkShortener';
import LinkyAccess from './pages/linky/LinkyAccess';
import LinkyList from './pages/linky/LinkyList';
import ExpenseLedger from './pages/expense/ExpenseLedger';
import AuthLogin from './pages/auth/AuthLogin';
import AuthRegister from './pages/auth/AuthRegister';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';

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
        <Route path="/auth/login" element={<AuthLogin />} />
        <Route path="/auth/register" element={<AuthRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
