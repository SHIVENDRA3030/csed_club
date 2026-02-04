import React from "react";
import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToTop from "./components/ScrollToTop";
import LiquidNav from "./components/LiquidNav";
import Footer from "./components/Footer";
import "./App.css";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const Projects = lazy(() => import("./pages/Projects"));
const Team = lazy(() => import("./pages/Teams"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const JoinUs = lazy(() => import("./pages/JoinUs"));

function App() {
	useEffect(() => {
		// Initialize Lenis smooth scrolling with optimized settings
		const lenis = new Lenis({
			lerp: 0.1, // Lower = smoother, higher = more responsive (0.05-0.15 recommended)
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			infinite: false,
		});

		// Connect Lenis to GSAP ScrollTrigger
		lenis.on("scroll", ScrollTrigger.update);

		// Use native requestAnimationFrame for better performance
		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		// Reset scroll on page unload
		window.onbeforeunload = function () {
			window.scrollTo(0, 0);
		};

		return () => {
			lenis.destroy();
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

