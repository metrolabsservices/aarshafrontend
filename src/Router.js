import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { Libraryindex } from "./Pages/Libraryindex";
import { Questionbankindex } from "./Pages/Questionbankindex";
import { Studentindex } from "./Pages/StudentsDivison/Studentindex";
import { Studentforms } from "./Pages/StudentsDivison/Studentforms";
import { Studentfeeform } from "./Pages/StudentsDivison/Studentfeeform";
import { MasterSelectors } from "./Pages/HomePage/MasterSelectors";
import { Dashboard } from "./Pages/HomePage/Dashboard";
import { Studenteditforms } from "./Pages/StudentsDivison/Studenteditforms";
import { Studentviewforms } from "./Pages/StudentsDivison/Studentviewforms";
import Login from "./Pages/LoginFlow/Login";
import { Register } from "./Pages/LoginFlow/Register";
import { LoginProfiles } from "./Pages/HomePage/LoginProfiles";
import { StudentInfo } from "./Pages/HomePage/StudentInfo";
import { ReceiptGenerater } from "./GenericComponents/ReceiptGenerater";
import { Expensesindex } from "./Pages/TransactionsPage/Expensesindex";
import { TransactionForm } from "./Pages/TransactionsPage/TransactionForm";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fee" element={<ReceiptGenerater />} />
        <Route path="/main" element={<AppLayout />}>
          {/* ++++++++++++++ Home page ++++++++++++++ */}
          <Route path="/main/home" element={<Dashboard />} />

          {/* ---------  Home page / Login Page ------- */}
          <Route path="/main/home/loginprofiles" element={<LoginProfiles />} />

          {/* ---------  Home page / MasterSelector Page ------- */}
          <Route
            path="/main/home/masterselectors"
            element={<MasterSelectors />}
          />

          {/* ---------- Home page / Student Info Page */}
          <Route path="/main/home/studentinfo" element={<StudentInfo />} />

          {/* ++++++++++ Student Page ++++++++++++ */}
          <Route path="/main/studentpage" element={<Studentindex />} />

          {/* ---------  Student Page / new form Page ------- */}
          <Route
            path="/main/studentpage/newstudent"
            element={<Studentforms />}
          />

          {/* ---------  Student Page / edit form Page ------- */}
          <Route
            path="/main/studentpage/editstudent/:usertoken"
            element={<Studenteditforms />}
          />

          {/* ---------  Student Page / view Page ------- */}
          <Route
            path="/main/studentpage/viewstudent/:usertoken"
            element={<Studentviewforms />}
          />

          {/* ---------  Student Page / feereceipt Page ------- */}
          <Route
            path="/main/studentpage/feereceipt"
            element={<Studentfeeform />}
          />

          {/* ---------   Transaction Page ------- */}
          <Route path="/main/transactionspage" element={<Expensesindex />} />

          {/* ---------   Transaction Page  / add trx form------- */}
          <Route
            path="/main/transactionspage/addtrx"
            element={<TransactionForm />}
          />

          {/* ---------   Transaction Page  / Edit trx form------- */}
          <Route
            path="/main/transactionspage/trxedit/:id"
            element={<TransactionForm />}
          />

          {/* ---------   Transaction Page  / Transaction Charts------- */}
          <Route
            path="/main/transactionspage/trxchartspage"
            element={<TransactionForm />}
          />

          {/* ---------  Library Page ------- */}
          <Route path="/main/librarypage" element={<Libraryindex />} />

          {/* ---------  Question Bank Page ------- */}
          <Route
            path="/main/questionbankpage"
            element={<Questionbankindex />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
