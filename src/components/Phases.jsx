import React, { useRef, useEffect } from "react";
import "./Phases.css";

export default function Phases(props) {
	const canvasRef = useRef(null);
	const viewportRef = useRef(null);
	const revealContainerRef = useRef(null);
	const headlineRef = useRef(null);
	const particlesRef = useRef([]);
	const animationFrameRef = useRef(null);

	// Particle class for canvas animation
	class Particle {
		constructor(canvas) {
			this.canvas = canvas;
			this.init();
		}

		init() {
			this.x = Math.random() * this.canvas.width;
			this.y = Math.random() * this.canvas.height;
			this.size = Math.random() * 2 + 0.5;
			this.speedX = (Math.random() - 0.5) * 0.5;
			this.speedY = (Math.random() - 0.5) * 0.5;
			this.life = Math.random() * 100;
			this.isEmber = Math.random() > 0.5;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
			if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
			this.life -= 0.1;
			if (this.life <= 0) this.init();
		}

		draw(ctx) {
			const color = this.isEmber ? "255, 77, 0" : "0, 242, 255";
			const opacity = (this.life / 100) * 0.6;
			ctx.shadowBlur = 10;
			ctx.shadowColor = `rgba(${color}, ${opacity})`;
			ctx.fillStyle = `rgba(${color}, ${opacity})`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Resize canvas
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		// Initialize particles
		const particleCount =
			window.innerWidth < 768 ? 40 : 100;
		particlesRef.current = [];
		const isLowEnd =
			navigator.hardwareConcurrency &&
			navigator.hardwareConcurrency <= 4;

		if (!isLowEnd) {
			for (let i = 0; i < particleCount; i++) {
				particlesRef.current.push(new Particle(canvas));
			}
		}

		// Animation loop
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			particlesRef.current.forEach((p) => {
				p.update();
				p.draw(ctx);
			});
			animationFrameRef.current = requestAnimationFrame(animate);
		};

		if (particlesRef.current.length > 0) {
			animate();
		}

		// Line-by-line scroll reveal
		const observerOptions = {
			threshold: 0.2,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const lines =
						entry.target.querySelectorAll(".line-inner");
					lines.forEach((line, i) => {
						setTimeout(() => {
							line.classList.add("visible");
						}, i * 200);
					});
				}
			});
		}, observerOptions);

		if (revealContainerRef.current) {
			observer.observe(revealContainerRef.current);
		}

		// Parallax interaction
		const handleMouseMove = (e) => {
			if (window.innerWidth < 768 || !headlineRef.current) return;
			const x =
				((e.clientX / window.innerWidth - 0.5) * 20);
			const y =
				((e.clientY / window.innerHeight - 0.5) * 20);
			headlineRef.current.style.transform = `rotateX(${
				10 - y
			}deg) rotateY(${x}deg)`;
		};

		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("resize", handleResize);
			document.removeEventListener("mousemove", handleMouseMove);
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			observer.disconnect();
		};
	}, []);

	// Build taglines from props
	const taglines = [];
	if (props.tagline_1) taglines.push(props.tagline_1);
	if (props.tagline_2) taglines.push(props.tagline_2);
	if (props.tagline_3) taglines.push(props.tagline_3);

	// Split content into lines for reveal effect
	const contentLines = props.content
		? props.content
				.split("\n")
				.filter((line) => line.trim().length > 0)
		: [];

	return (
		<section className="kinetic-viewport" ref={viewportRef}>
			<canvas ref={canvasRef} className="particle-canvas"></canvas>

			{props.heading && (
				<div className="capsule">{props.heading}</div>
			)}

			<div className="headline-container">
				<h1 className="headline-3d" ref={headlineRef}>
					{taglines.map((line, idx) => (
						<React.Fragment key={idx}>
							{line}
							{idx < taglines.length - 1 && <br />}
						</React.Fragment>
					))}
				</h1>
			</div>

			<div
				className="content-body"
				ref={revealContainerRef}
			>
				{contentLines.length > 0 ? (
					contentLines.map((line, idx) => (
						<div key={idx} className="line-reveal">
							<span className="line-inner">
								{line.trim()}
							</span>
						</div>
					))
				) : (
					<div className="line-reveal">
						<span className="line-inner">
							{props.content}
						</span>
					</div>
				)}
			</div>
		</section>
	);
}
