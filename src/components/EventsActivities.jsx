import { useEffect, useRef, memo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EventsActivities.css";

gsap.registerPlugin(ScrollTrigger);

const EventsActivities = memo(function EventsActivities() {
	const canvasRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// THREE.JS SETUP
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setClearColor(0x000000, 0); // Transparent background
		renderer.setPixelRatio(window.devicePixelRatio);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		camera.position.z = 5;

		const shapes = [];
		const group = new THREE.Group();
		scene.add(group);

		// Materials
		const crystalMat = new THREE.MeshPhongMaterial({
			color: 0x00a3ff,
			emissive: 0x002244,
			transparent: true,
			opacity: 0.6,
			shininess: 100,
			wireframe: false,
		});

		const wireMat = new THREE.MeshBasicMaterial({
			color: 0x00d4ff,
			wireframe: true,
			transparent: true,
			opacity: 0.2,
		});

		// Create random geometries
		const geometries = [
			new THREE.IcosahedronGeometry(1, 0),
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.OctahedronGeometry(1, 0),
		];

		for (let i = 0; i < 12; i++) {
			const geo = geometries[Math.floor(Math.random() * geometries.length)];
			const mesh = new THREE.Mesh(geo, crystalMat);
			const wire = new THREE.Mesh(geo, wireMat);

			const x = (Math.random() - 0.5) * 12;
			const y = (Math.random() - 0.5) * 8;
			const z = (Math.random() - 0.5) * 4;

			mesh.position.set(x, y, z);
			wire.position.set(x, y, z);

			const scale = Math.random() * 0.5 + 0.2;
			mesh.scale.set(scale, scale, scale);
			wire.scale.set(scale + 0.02, scale + 0.02, scale + 0.02);

			const rotSpeed = {
				x: (Math.random() - 0.5) * 0.01,
				y: (Math.random() - 0.5) * 0.01,
			};

			shapes.push({
				mesh,
				wire,
				rotSpeed,
				basePos: { x, y, z },
				offset: Math.random() * Math.PI * 2,
			});
			group.add(mesh);
			group.add(wire);
		}

		// Particle System - Reduced count for better performance
		const particlesCount = 20;
		const posArray = new Float32Array(particlesCount * 3);
		for (let i = 0; i < particlesCount * 3; i++) {
			posArray[i] = (Math.random() - 0.5) * 15;
		}
		const particlesGeo = new THREE.BufferGeometry();
		particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
		const particlesMat = new THREE.PointsMaterial({ 
			size: 0.03, 
			color: 0x00d4ff,
			transparent: true,
			opacity: 0.8
		});
		const particleMesh = new THREE.Points(particlesGeo, particlesMat);
		scene.add(particleMesh);

		// Lighting
		const mainLight = new THREE.DirectionalLight(0xffffff, 1);
		mainLight.position.set(5, 5, 5);
		scene.add(mainLight);

		const blueLight = new THREE.PointLight(0x00d4ff, 2, 10);
		blueLight.position.set(-2, -2, 2);
		scene.add(blueLight);

		function resize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		window.addEventListener("resize", resize);
		resize();

		function animate() {
			const time = Date.now() * 0.001;

			shapes.forEach((s) => {
				s.mesh.rotation.x += s.rotSpeed.x;
				s.mesh.rotation.y += s.rotSpeed.y;
				s.wire.rotation.x += s.rotSpeed.x;
				s.wire.rotation.y += s.rotSpeed.y;

				// Floating motion
				s.mesh.position.y = s.basePos.y + Math.sin(time + s.offset) * 0.2;
				s.wire.position.y = s.basePos.y + Math.sin(time + s.offset) * 0.2;
			});

			group.rotation.y += 0.001;
			particleMesh.rotation.y -= 0.0005;

			renderer.render(scene, camera);
			
			// Use setTimeout for better performance control
			setTimeout(() => requestAnimationFrame(animate), 16); // ~60fps
		}
		animate();

		// Cleanup
		return () => {
			window.removeEventListener("resize", resize);
			renderer.dispose();
			shapes.forEach(s => {
				if (s.mesh && s.mesh.geometry) s.mesh.geometry.dispose();
				if (s.wire && s.wire.geometry) s.wire.geometry.dispose();
			});
			if (particleMesh && particleMesh.geometry) particleMesh.geometry.dispose();
			if (particlesMat) particlesMat.dispose();
			if (crystalMat) crystalMat.dispose();
			if (wireMat) wireMat.dispose();
		};
	}, []);

	useEffect(() => {
		// GSAP SCROLL ANIMATIONS - Optimized for performance
	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: containerRef.current,
			start: "top 80%",
			end: "bottom 60%",
			scrub: 1,
			markers: false,
			fastScrollEnd: true,
			preventOverlaps: true,
		},
	});

	// Entrance: Slide in from Left
	timeline.from(
		".events-title",
		{
			x: -150,
			opacity: 0,
			duration: 0.6,
			ease: "power2.out",
		},
		0
	);

	timeline.from(
		".events-desc-line",
		{
			x: -100,
			opacity: 0,
			duration: 0.6,
			stagger: 0.1,
			ease: "power2.out",
		},
		0.15
	);

	timeline.from(
		".events-meta-tag",
		{
			y: 20,
			opacity: 0,
			duration: 0.4,
		},
		0
	);

	// Center Pause - keep elements visible
	timeline.to(
		".events-glass-card",
		{
			boxShadow: "0 0 40px rgba(0, 163, 255, 0.2)",
			duration: 0.4,
		},
		0.4
	);

	// Keep elements visible - no exit animation
	timeline.to(
		".events-desc-line",
		{
			x: 0,
			opacity: 1,
			duration: 0.6,
			stagger: 0.1,
			ease: "power2.out",
		},
		0.8
	);

	timeline.to(
		".events-title",
		{
			x: 0,
			opacity: 1,
			duration: 0.6,
			ease: "power2.out",
		},
		0.95
	);

	timeline.to(
		".events-meta-tag",
		{
			opacity: 1,
			duration: 0.3,
		},
		1.0
	);

		return () => {
			timeline.kill();
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, []);

	return (
		<div className="events-scroll-container" ref={containerRef}>
			<div className="events-section-wrapper">
				<canvas id="three-canvas" ref={canvasRef}></canvas>

				<div className="events-content-overlay">
					<div className="events-glass-card">
						<span className="events-meta-tag">CSED // INITIATIVE</span>
						<h1 className="events-title">Events & Activities</h1>
						<p className="events-description">
							<span className="events-desc-line">
								The CSED Club nurtures startup mindsets through
							</span>
							<span className="events-desc-line">
								mentorship, resources, and networking opportunities.
							</span>
							<span className="events-desc-line">
								It hosts events and connects students with leaders
							</span>
							<span className="events-desc-line">
								to build impactful ventures.
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
});

export default EventsActivities;
