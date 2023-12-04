import { HashRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { Dashboard } from "./Pages/Dashboard";
import { Studentindex } from "./Pages/Studentindex";
import { Expensesindex } from "./Pages/Expensesindex";
import { Libraryindex } from "./Pages/Libraryindex";
import { Questionbankindex } from "./Pages/Questionbankindex";

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Home_B" element={<Studentindex />} />
          <Route path="/Home_C" element={<Expensesindex />} />
          <Route path="/Home_D" element={<Libraryindex />} />
          <Route path="/Home_E" element={<Questionbankindex />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
