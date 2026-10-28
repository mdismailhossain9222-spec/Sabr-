import Home from "./pages/Home";
import WhatsAppButton from "./components/WhatsAppButton";
import SmoothScroll from "./components/SmoothScroll";

export default function App() {
  return (
    <SmoothScroll>
      <Home />
      <WhatsAppButton />
    </SmoothScroll>
  );
}
