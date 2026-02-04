import React from "react";
import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import LiquidNav from "./components/LiquidNav";
import Footer from "./components/Footer";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const Projects = lazy(() => import("./pages/Projects"));
const Team = lazy(() => import("./pages/Teams"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const JoinUs = lazy(() => import("./pages/JoinUs"));

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
				<Suspense fallback={
					<div className="flex items-center justify-center h-screen bg-black text-white">
						Loading...
					</div>
				}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/team" element={<Team />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/events" element={<Events />} />
						<Route path="/newsletter" element={<Newsletter />} />
						<Route path="/join" element={<JoinUs />} />
					</Routes>
				</Suspense>
				<Footer />
			</Router>
		</>
	);
}

export default App;
