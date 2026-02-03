import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import LiquidNav from "./components/LiquidNav";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Projects from "./pages/Projects";
import Team from "./pages/Teams";
import Newsletter from "./pages/Newsletter";
import JoinUs from "./pages/JoinUs";
import Footer from "./components/Footer";
import "./App.css";

function App() {
	useEffect(() => {
		window.onbeforeunload = function () {
			window.scrollTo(0, 0);
		};
	}, []);
	return (
		<>
			<div id="reload-fade" className="hide" style={{ opacity: 0, pointerEvents: "none" }}></div>
			<Router>
				<ScrollToTop />
				<LiquidNav />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/team" element={<Team />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/events" element={<Events />} />
					<Route path="/newsletter" element={<Newsletter />} />
					<Route path="/join" element={<JoinUs />} />
				</Routes>
				<Footer />
			</Router>
		</>
	);
}

export default App;
