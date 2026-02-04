import React from "react";
import { useRef, useState, useEffect } from "react";
import "./HomeGradient.css";

const DeployXMission = () => {
	const consoleRef = useRef(null);
	const [networkLoad, setNetworkLoad] = useState(84.2);

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!consoleRef.current) return;
			const x = (window.innerWidth / 2 - e.clientX) / 25;
			const y = (window.innerHeight / 2 - e.clientY) / 25;
			consoleRef.current.style.transform = `rotateY(${-x}deg) rotateX(${y}deg)`;
		};

		const handleScroll = () => {
			const scrolled = window.pageYOffset;
			const topoBackground = document.querySelector(".topo-background");
			if (topoBackground) {
				topoBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
			}
		};

		// Update network load periodically
		const hudInterval = setInterval(() => {
			setNetworkLoad((80 + Math.random() * 5).toFixed(1));
		}, 2000);

		document.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("scroll", handleScroll);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("scroll", handleScroll);
			clearInterval(hudInterval);
		};
	}, []);

	return (
		<div className="deployx-wrapper">
			<div className="grain">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<filter id="noiseFilter">
						<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
					</filter>
					<rect width="100%" height="100%" filter="url(#noiseFilter)" />
				</svg>
			</div>

			<div className="topo-background"></div>
			<div className="grid-overlay"></div>
			<div className="scanner-line"></div>

			<div className="scene">
				<div className="mission-console" ref={consoleRef}>
					{/* Left HUD */}
					<div className="hud-panel panel-left">
						<span className="hud-label">System Status</span>
						<div className="hud-value">NEURAL_SYNC: ACTIVE</div>
						<span className="hud-label">Network Load</span>
						<div className="hud-value">{networkLoad}%</div>
						<div style={{
							height: "2px",
							background: "var(--copper-dark)",
							width: "100%",
							position: "relative"
						}}>
							<div style={{
								height: "100%",
								background: "var(--copper-primary)",
								width: `${networkLoad}%`
							}}></div>
						</div>
						<br />
						<span className="hud-label">Latent Space</span>
						<div className="hud-value">OPTIMIZED</div>
					</div>

					{/* Main Content */}
					<div className="title-container">
						<h1 className="mission-title">DEPLOYX</h1>
						<div className="mission-info">
							<div>MISSION TYPE: <span className="highlight">ML & MLOps Bootcamp + Hackathon</span></div>
							<div>MISSION DATE: <span className="highlight">6–7 February 2026</span></div>
						</div>
					</div>

					<button className="cta-button">START MISSION</button>

					{/* Right HUD */}
					<div className="hud-panel panel-right">
						<span className="hud-label">Location Data</span>
						<div className="hud-value">VECTOR COORDINATES: 28.6° / 77.2°</div>
						<span className="hud-label">Encryption</span>
						<div className="hud-value">SHA-256 COPPER_KEY</div>
						<span className="hud-label">Objectives</span>
						<div className="hud-value" style={{ fontSize: "0.75rem" }}>
							1. TRAIN_MODELS<br />
							2. ORCHESTRATE_PIPELINES<br />
							3. DEPLOY_PRODUCTION
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function HomeGradient() {
	const cardGridRef = useRef(null);
	const cardsRef = useRef([]);
	const sceneRef = useRef(null);

	const statsData = [
		{ number: 50, label: "Events Managed", accentColor: "#9d00ff" },
		{ number: 12, label: "Hackathons Hosted", accentColor: "#ff00c8" },
		{ number: 60, label: "Alumni Members", accentColor: "#ff6b00" },
		{ number: 10, label: "Tie-up Companies", accentColor: "#00f2ff" },
	];

	useEffect(() => {
		const isTouch = "ontouchstart" in window;

		if (!isTouch && cardsRef.current.length > 0) {
			cardsRef.current.forEach((card) => {
				const handleMouseMove = (e) => {
					const rect = card.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const y = e.clientY - rect.top;

					card.style.setProperty("--mouse-x", `${x}px`);
					card.style.setProperty("--mouse-y", `${y}px`);

					const centerX = rect.width / 2;
					const centerY = rect.height / 2;
					const rotateX = (y - centerY) / 10;
					const rotateY = (centerX - x) / 10;

					card.style.transform = `
						perspective(1000px)
						rotateX(${rotateX}deg)
						rotateY(${rotateY}deg)
						translateZ(60px)
						scale(1.05)
					`;
				};

				const handleMouseLeave = () => {
					card.style.transform = `
						perspective(1000px)
						rotateX(0deg)
						rotateY(0deg)
						translateZ(0px)
						scale(1)
					`;
				};

				card.addEventListener("mousemove", handleMouseMove);
				card.addEventListener("mouseleave", handleMouseLeave);

				return () => {
					card.removeEventListener("mousemove", handleMouseMove);
					card.removeEventListener("mouseleave", handleMouseLeave);
				};
			});

			const handleDocumentMouseMove = (e) => {
				if (cardGridRef.current) {
					const moveX = (window.innerWidth / 2 - e.pageX) / 50;
					const moveY = (window.innerHeight / 2 - e.pageY) / 50;
					cardGridRef.current.style.transform = `rotateY(${
						-15 + moveX
					}deg) rotateX(${10 + moveY}deg)`;
				}
			};

			document.addEventListener("mousemove", handleDocumentMouseMove);

			return () => {
				document.removeEventListener("mousemove", handleDocumentMouseMove);
			};
		} else if (isTouch) {
			// Mobile touch interactions
			cardsRef.current.forEach((card) => {
				const handleTouchStart = () => {
					card.style.transform = "scale(0.95) translateZ(0)";
					card.style.background = "rgba(255, 255, 255, 0.15)";
				};

				const handleTouchEnd = () => {
					card.style.transform = "scale(1) translateZ(0)";
					card.style.background = "var(--glass-white)";
				};

				card.addEventListener("touchstart", handleTouchStart);
				card.addEventListener("touchend", handleTouchEnd);

				return () => {
					card.removeEventListener("touchstart", handleTouchStart);
					card.removeEventListener("touchend", handleTouchEnd);
				};
			});
		}

		// Visibility observer for animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.style.animationPlayState = "running";
					} else {
						entry.target.style.animationPlayState = "paused";
					}
				});
			},
			{ threshold: 0.1 }
		);

		document
			.querySelectorAll(".membrane-blob")
			.forEach((blob) => observer.observe(blob));

		return () => {
			document
				.querySelectorAll(".membrane-blob")
				.forEach((blob) => observer.unobserve(blob));
		};
	}, []);

	return (
		<>
			<section className="flux-section">
				<div className="ambient-membrane">
					<div className="membrane-blob blob-1"></div>
					<div className="membrane-blob blob-2"></div>
				</div>

				<div className="main-grid">
					<div className="content-block">
						<h1 className="title-reveal">
							Center for <br />
							<span style={{ color: "var(--accent-purple)" }}>
								Skills
							</span>{" "}
							& <br />
							Entrepreneurship
						</h1>
						<p className="description">
							Forging the next generation of digital architects. We
							provide the ecosystem where student innovators
							transition from dreaming to building
							industry-disrupting ventures.
						</p>
					</div>

					<div className="scene-3d" ref={sceneRef}>
						<div className="card-grid" ref={cardGridRef}>
							{statsData.map((stat, index) => (
								<div
									key={index}
									className="flux-card"
									ref={(el) => (cardsRef.current[index] = el)}
									style={{
										"--accent-color": stat.accentColor,
									}}
								>
									<span className="card-val">
										{stat.number}+
									</span>
									<span className="card-label">
										{stat.label}
									</span>
									<div className="glow-edge"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<DeployXMission />
		</>
	);
}
