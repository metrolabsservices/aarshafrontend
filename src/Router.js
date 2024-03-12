import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { Expensesindex } from "./Pages/Expensesindex";
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

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<AppLayout />}>
          <Route path="/main/home" element={<Dashboard />} />
          <Route
            path="/main/home/masterselectors"
            element={<MasterSelectors />}
          />
          <Route path="/main/studentpage" element={<Studentindex />} />
          <Route
            path="/main/studentpage/newstudent"
            element={<Studentforms />}
          />
          <Route
            path="/main/studentpage/editstudent/:usertoken"
            element={<Studenteditforms />}
          />
          <Route
            path="/main/studentpage/viewstudent/:usertoken"
            element={<Studentviewforms />}
          />
          <Route
            path="/main/studentpage/feereceipt"
            element={<Studentfeeform />}
          />
          <Route path="/main/Home_C" element={<Expensesindex />} />
          <Route path="/main/Home_D" element={<Libraryindex />} />
          <Route path="/main/Home_E" element={<Questionbankindex />} />
        </Route>
      </Routes>
    </BrowserRouter>
    // <HashRouter>
    //   <Routes>
    //     <Route path="/" element={<AppLayout />}>
    //       <Route path="/home" element={<Dashboard />} />
    //       <Route path="/home/masterselectors" element={<MasterSelectors />} />
    //       <Route path="/Home_B" element={<Studentindex />} />
    //       <Route path="/Home_B/newstudent" element={<Studentforms />} />
    //       <Route
    //         path="/Home_B/editstudent/:usertoken"
    //         element={<Studenteditforms />}
    //       />
    //       <Route
    //         path="/Home_B/viewstudent/:usertoken"
    //         element={<Studentviewforms />}
    //       />
    //       <Route path="/Home_B/feereceipt" element={<Studentfeeform />} />
    //       <Route path="/Home_C" element={<Expensesindex />} />
    //       <Route path="/Home_D" element={<Libraryindex />} />
    //       <Route path="/Home_E" element={<Questionbankindex />} />
    //     </Route>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //   </Routes>
    // </HashRouter>
  );
};
