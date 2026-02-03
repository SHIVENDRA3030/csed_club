import { useRef, useEffect, useState } from "react";
import "./FloatingText.css";

export default function FloatingText(props) {
	const sectionRef = useRef(null);
	const spineRef = useRef(null);
	const contentRef = useRef(null);
	const layersRef = useRef([]);
	const [isRevealed, setIsRevealed] = useState(false);

	useEffect(() => {
		// Reveal on load
		const timer = setTimeout(() => {
			setIsRevealed(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!spineRef.current || !layersRef.current) return;

			const x = (e.clientX / window.innerWidth - 0.5) * 20;
			const y = (e.clientY / window.innerHeight - 0.5) * 20;

			// Move spine subtly
			spineRef.current.style.setProperty("--my", `${x}deg`);
			spineRef.current.style.setProperty("--mx", `${-y}deg`);

			// Shift background layers for parallax depth
			layersRef.current.forEach((layer, index) => {
				layer.style.transform = `rotateX(75deg) translateZ(${-400 - index * 200}px) translateX(${
					x * (index + 1)
				}px) translateY(${y * (index + 1)}px)`;
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (!spineRef.current || !layersRef.current) return;

			const scrolled = window.scrollY;

			// Spine reacts as if powered by scroll energy
			spineRef.current.style.gap = `${12 + scrolled * 0.1}px`;

			layersRef.current.forEach((layer, index) => {
				const zShift = -400 - index * 200 + scrolled * 0.5;
				layer.style.transform = `rotateX(75deg) translateZ(${zShift}px)`;
			});
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		// Technical flicker effect occasionally
		const flickerInterval = setInterval(() => {
			if (spineRef.current) {
				spineRef.current.style.opacity = "0.8";
				setTimeout(() => {
					if (spineRef.current) {
						spineRef.current.style.opacity = "1";
					}
				}, 50);
			}
		}, 4000);

		return () => clearInterval(flickerInterval);
	}, []);

	return (
		<section className="cyborg-core-section" ref={sectionRef}>
			<div className="machine-interior" id="parallaxContainer">
				<div
					className="grid-layer"
					style={{ transform: "rotateX(75deg) translateZ(-400px) scale(1.1)" }}
					ref={(el) => (layersRef.current[0] = el)}
				></div>
				<div
					className="grid-layer"
					style={{ transform: "rotateX(75deg) translateZ(-600px) scale(1.3)", opacity: 0.1 }}
					ref={(el) => (layersRef.current[1] = el)}
				></div>
				<div className="depth-haze"></div>
			</div>

			<div className="strata-spine" id="spine" ref={spineRef}>
				<div className="segment"></div>
				<div className="segment"></div>
				<div className="segment"></div>
				<div className="segment"></div>
				<div className="segment"></div>
				<div className="segment"></div>
			</div>

			<div className={`content-stack ${isRevealed ? "revealed" : ""}`} id="content" ref={contentRef}>
				<h1 className="title">Events &<br />Activities</h1>
				<p className="body-text">
					{props.contentLine1 ||
						"Our goal is to bridge the gap between learning and doing by helping members gain real-world skills, inspire others, and grow together through collaboration and contribution. CSED club is where it all begins — a place where learning, leading, and contributing go hand in hand."}
				</p>
			</div>

			<div className="scroll-indicator">System Active // Core Memory 01</div>
		</section>
	);
}
