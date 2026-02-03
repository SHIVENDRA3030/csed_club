import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./LightPipeButton.css";

export default function LightPipeButton() {
	const containerRef = useRef(null);

	const handleMouseMove = (e) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = (y - centerY) / 8;
		const rotateY = (centerX - x) / 12;

		containerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
	};

	const handleMouseLeave = () => {
		if (!containerRef.current) return;
		containerRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
	};

	return (
		<button
			className="vp-lightpipe-btn"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div className="vp-btn-container" ref={containerRef}>
				{/* Optical Fiber Pipes */}
				<div className="vp-pipe vp-pipe-top"></div>
				<div className="vp-pipe vp-pipe-bottom"></div>
				<div className="vp-pipe vp-pipe-left"></div>
				<div className="vp-pipe vp-pipe-right"></div>

				{/* Refraction Elements */}
				<div className="vp-refraction"></div>
				<div className="vp-internal-light"></div>

				{/* Hardware Accents */}
				<div className="vp-bracket b-tl"></div>
				<div className="vp-bracket b-tr"></div>
				<div className="vp-bracket b-bl"></div>
				<div className="vp-bracket b-br"></div>

				{/* Content */}
				<Link to="/join" className="vp-label-group">
					<span className="vp-sub-text">Initialize Protocol</span>
					<span className="vp-main-text">Join Now</span>
					<span className="vp-sub-text">Node ID: 88-FX-ALPHA</span>
				</Link>
			</div>
		</button>
	);
}
