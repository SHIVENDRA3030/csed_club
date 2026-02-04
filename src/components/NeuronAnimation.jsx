import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./NeuronAnimation.css";

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// --- HELPER FUNCTION TO GET COORDINATES FROM TEXT/SHAPES ---
function getCoordinatesForShape(
	text,
	canvasWidth,
	canvasHeight,
	fontSize = 160
) {
	const tempCanvas = document.createElement("canvas");
	const tempCtx = tempCanvas.getContext("2d");
	tempCanvas.width = canvasWidth;
	tempCanvas.height = canvasHeight;

	tempCtx.fillStyle = "white";
	tempCtx.font = `bold ${fontSize}px 'Arial', sans-serif`;
	tempCtx.textAlign = "center";
	tempCtx.textBaseline = "middle";
	tempCtx.fillText(text, canvasWidth / 2, canvasHeight / 2);

	const pixels = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
	const coordinates = [];
	const sampling = 5;

	for (let y = 0; y < canvasHeight; y += sampling) {
		for (let x = 0; x < canvasWidth; x += sampling) {
			const index = (y * canvasWidth + x) * 4;
			if (pixels[index + 3] > 128) {
				coordinates.push({ x: x, y: y });
			}
		}
	}
	return coordinates;
}

const NeuronAnimation = () => {
	const canvasRef = useRef(null);
	const animationRef = useRef({});

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Defer heavy calculation to avoid blocking main thread on mount
		const initTimer = setTimeout(() => {

			const TOTAL_NEURONS = 1000;
			const anim = animationRef.current;

			// --- CHANGE 1: USE AN OBJECT FOR THE SUBTEXT TO ANIMATE ITS OPACITY ---
			anim.subtext = {
				content: "Join Us. Explore Innovation.",
				opacity: 1,
				fontSize: "12px",
			};

			anim.csedCoords = getCoordinatesForShape(
				"CSED",
				canvas.width,
				canvas.height,
				115
			);
			anim.robotCoords = getCoordinatesForShape(
				"(-O.O-)",
				canvas.width,
				canvas.height,
				140
			);
			anim.brainCoords = getCoordinatesForShape(
				"🧠",
				canvas.width,
				canvas.height,
				200
			);
			anim.entrepreneurCoords = getCoordinatesForShape(
				"|₹|",
				canvas.width,
				canvas.height,
				180
			);
			anim.handshakeCoords = getCoordinatesForShape(
				"🤝",
				canvas.width,
				canvas.height,
				200
			);

			anim.neurons = [];
			for (let i = 0; i < TOTAL_NEURONS; i++) {
				const initialX = Math.random() * canvas.width;
				const initialY = Math.random() * canvas.height;
				anim.neurons.push({
					x: initialX,
					y: initialY,
					initialX: initialX,
					initialY: initialY,
					radius: Math.random() * 2 + 1,
					opacity: 1,
				});
			}

			const drawFrame = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				anim.neurons.forEach((neuron) => {
					ctx.beginPath();
					ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(173, 216, 230, ${neuron.opacity * 0.9})`;
					ctx.shadowColor = `rgba(255, 255, 255, ${neuron.opacity})`;
					ctx.shadowBlur = 10;
					ctx.fill();
				});
				ctx.shadowBlur = 0;

				// --- CHANGE 2: DRAW THE SUBTEXT USING ITS OPACITY PROPERTY ---
				ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * anim.subtext.opacity
					})`;
				ctx.font = "bolder clamp(22px, 5.5vw, 44px) Arial";
				ctx.textAlign = "center";
				const yPosition = canvas.height / 2 + 200 / 2 + 35;
				ctx.fillText(anim.subtext.content, canvas.width / 2, yPosition);
			};

			anim.mainTimeline = gsap.timeline({
				repeat: -1,
				onUpdate: drawFrame,
			});

			const morphToShape = (coords, duration, delay = 0) => {
				anim.mainTimeline.to(
					anim.neurons,
					{
						duration: duration,
						ease: "power2.inOut",
						x: (i) => coords[i % coords.length].x,
						y: (i) => coords[i % coords.length].y,
						stagger: { amount: 0.8, from: "random" },
					},
					`+=${delay}`
				);
			};

			morphToShape(anim.csedCoords, 1.5);
			anim.mainTimeline.to({}, { duration: 1.5 });

			morphToShape(anim.robotCoords, 2.0);
			anim.mainTimeline.call(
				() => {
					if (anim.subtext.opacity > 0.1) {
						ctx.fillStyle = `rgba(255, 255, 255, ${anim.subtext.opacity})`;
						ctx.font = "bold 40px Arial";
						ctx.fillText(
							"Hi!",
							canvas.width / 2,
							canvas.height / 2 - 120
						);
					}
				},
				[],
				">-1.0"
			);
			anim.mainTimeline.to({}, { duration: 1.5 });

			morphToShape(anim.brainCoords, 1.5);
			anim.mainTimeline.to({}, { duration: 1.5 });

			morphToShape(anim.entrepreneurCoords, 1.5);
			anim.mainTimeline.to({}, { duration: 1.5 });

			morphToShape(anim.handshakeCoords, 1.5);
			anim.mainTimeline.to({}, { duration: 2.0 });

			anim.mainTimeline.to(anim.neurons, {
				duration: 0.2,
				ease: "power3.inOut",
				x: (i) => anim.neurons[i].initialX,
				y: (i) => anim.neurons[i].initialY,
				stagger: {
					amount: 1.0,
					from: "random",
				},
			});

			anim.scrollTimeline = gsap.timeline({
				onUpdate: drawFrame,
				paused: true,
			});

			// --- CHANGE 3: ADD THE TEXT FADE-OUT ANIMATION TO THE SCROLL TIMELINE ---
			// This makes the text fade out as the neurons start forming the spaceship.
			anim.scrollTimeline.to(anim.subtext, { opacity: 0, duration: 0.5 }, 0);

			anim.scrollTimeline.to(
				anim.neurons,
				{
					duration: 1.0,
					ease: "power1.inOut",
					x: (i) => canvas.width / 2 + (i / TOTAL_NEURONS - 0.5) * 400,
					y: (i) =>
						canvas.height / 3 + Math.abs(i / TOTAL_NEURONS - 0.5) * 400,
					stagger: { amount: 0.2 },
				},
				0
			); // Position at the start of the timeline

			anim.scrollTimeline.to(anim.neurons, {
				duration: 1.0,
				ease: "expo.in",
				x: `+=${Math.random() * 500 - 250}`,
				y: `+=${Math.random() * 500 - 250}`,
				opacity: 0,
				stagger: { amount: 0.4, from: "random" },
			});

			ScrollTrigger.create({
				trigger: ".App-header",
				start: "top top",
				end: "bottom top",
				scrub: 1.5,
				animation: anim.scrollTimeline,
				onEnter: () => {
					anim.mainTimeline.pause();
				},
				onLeaveBack: () => {
					anim.mainTimeline.restart();
					// Instantly reset text opacity to 1 when back at the top
					gsap.set(anim.subtext, { opacity: 1 });
				},
				onEnterBack: () => {
					anim.mainTimeline.pause();
				},
				onLeave: () => {
					gsap.to(anim.neurons, { opacity: 1, duration: 0.1 });
				},
			});

		}, 100);

		return () => {
			clearTimeout(initTimer);
			animationRef.current.mainTimeline?.kill();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return <canvas ref={canvasRef} id="neuron-canvas"></canvas>;
};

export default NeuronAnimation;
