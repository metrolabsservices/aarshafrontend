import { Router } from "./Router";
import { GuardProvider } from "./dbHub/GuardContext";

function App() {
  return (
    <GuardProvider>
      <Router />
    </GuardProvider>
  );
}

export default App;
