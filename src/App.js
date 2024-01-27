import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {

  document.title = "Atomic Weather"
  
  return (<Routes>

    <Route path="/" element={<Home />} />

  </Routes>)
}

export default App;
