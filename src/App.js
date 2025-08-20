import { Route, Routes} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Favourite from "./pages/Favourite";

export default function App() {
  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Favourite" element={<Favourite />} />
      </Route>
    </Routes>
    
    </>
  );
}
