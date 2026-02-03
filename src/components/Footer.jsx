import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
	useEffect(() => {
		// Simple Intersection Observer to trigger entrance animation on scroll
		const observerOptions = {
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.style.animation = "fadeIn 0.8s forwards";
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		document.querySelectorAll(".stagger-in").forEach((el) => {
			observer.observe(el);
		});

		// Smooth scroll to top for arrow button
		const arrowBtn = document.querySelector(".arrow-btn");
		if (arrowBtn) {
			arrowBtn.addEventListener("click", () => {
				window.scrollTo({ top: 0, behavior: "smooth" });
			});
		}

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<footer className="basalt-matrix w-full border-t border-white/5 pt-20 pb-10 px-6 lg:px-12 text-gray-400">
			<div className="noise-overlay"></div>

			<div className="max-w-7xl mx-auto relative z-10">
				{/* Main Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
					{/* Brand Column */}
					<div className="lg:col-span-1 stagger-in" style={{ animationDelay: "0.1s" }}>
						<h2 className="text-white text-2xl font-bold tracking-widest uppercase mb-4 glow-cyan leading-tight">
							CSED CLUB<br />
							GLAU
						</h2>
						<p className="text-xs uppercase tracking-widest text-gray-500 mb-8 mono">
							Subscribe to our blog
						</p>

						<button className="arrow-btn w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center pulse-glow group">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-cyan-400 group-hover:text-black"
							>
								<line x1="12" y1="19" x2="12" y2="5"></line>
								<polyline points="5 12 12 5 19 12"></polyline>
							</svg>
						</button>
					</div>

					{/* Projects */}
					<div className="stagger-in" style={{ animationDelay: "0.2s" }}>
						<h3 className="text-white font-bold uppercase text-sm tracking-wider mb-8">
							Our Projects
						</h3>
						<ul className="space-y-4 text-sm">
							<li>
								<Link to="/projects" className="link-hover block">
									GrimeRover
								</Link>
							</li>
							<li>
								<Link to="/projects" className="link-hover block">
									Drone
								</Link>
							</li>
							<li>
								<Link to="/projects" className="link-hover block">
									RC Car
								</Link>
							</li>
							<li>
								<Link to="/projects" className="link-hover block">
									Aaroi
								</Link>
							</li>
						</ul>
					</div>

					{/* Useful Links */}
					<div className="stagger-in" style={{ animationDelay: "0.3s" }}>
						<h3 className="text-white font-bold uppercase text-sm tracking-wider mb-8">
							Useful Links
						</h3>
						<ul className="space-y-4 text-sm">
							<li>
								<Link to="/" className="link-hover block">
									Home
								</Link>
							</li>
							<li>
								<Link to="/team" className="link-hover block">
									Team
								</Link>
							</li>
							<li>
								<Link to="/events" className="link-hover block">
									Events
								</Link>
							</li>
							<li>
								<Link to="/projects" className="link-hover block">
									Project
								</Link>
							</li>
						</ul>
					</div>

					{/* Social */}
					<div className="stagger-in" style={{ animationDelay: "0.4s" }}>
						<h3 className="text-white font-bold uppercase text-sm tracking-wider mb-8">
							Social
						</h3>
						<ul className="space-y-4 text-sm">
							<li>
								<a
									href="https://www.instagram.com/csed_club_glau/"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 group transition-all duration-300 hover:text-white"
								>
									<span className="w-8 h-8 rounded border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all">
										<i className="fa-brands fa-instagram"></i>
									</span>
									Instagram
								</a>
							</li>
							<li>
								<a
									href="https://www.linkedin.com/company/csed-club-glau/posts/?feedView=all"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 group transition-all duration-300 hover:text-white"
								>
									<span className="w-8 h-8 rounded border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all">
										<i className="fa-brands fa-linkedin"></i>
									</span>
									LinkedIn
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className="stagger-in" style={{ animationDelay: "0.5s" }}>
						<h3 className="text-white font-bold uppercase text-sm tracking-wider mb-8">
							Contact
						</h3>
						<div className="space-y-4 text-sm">
							<p className="flex items-start gap-2">
								<span className="text-cyan-400 mono mt-1">LOC:</span>
								GLAU, Mathura
							</p>
							<p className="flex items-start gap-2">
								<span className="text-cyan-400 mono mt-1">EML:</span>
								<a href="mailto:csed.club@gla.ac.in" className="hover:text-white transition-colors">
									csed.club@gla.ac.in
								</a>
							</p>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-white/5 flex flex-col items-center justify-center space-y-4">
					<div className="flex gap-6 mb-2">
						<div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
						<div className="w-2 h-2 rounded-full bg-cyan-500/20 blur-sm"></div>
						<div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
					</div>
					<p className="text-xs mono tracking-widest uppercase text-gray-600">
						© 2025 CSED CLUB GLAU. All rights reserved.
					</p>
				</div>
			</div>

			{/* Decorative Bioluminescent Accent */}
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
		</footer>
	);
}
