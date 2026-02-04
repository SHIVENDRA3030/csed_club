import React, { Suspense, lazy, memo, useCallback } from "react";
const NeuronAnimation = lazy(() => import("../components/NeuronAnimation"));
import FloatingText from "../components/FloatingText";
import EventsActivities from "../components/EventsActivities";
import HomeGradient from "../components/HomeGradient";
import Phases from "../components/Phases";
import LightPipeButton from "../components/LightPipeButton";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Home = memo(function Home() {
	useGSAP(() => {
		gsap.fromTo(
			".apply-now-container",
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".apply-now-container",
					start: "top 80%",
					end: "bottom 20%",
					scrub: 1,
				},
			}
		);
	});

	return (
		<>
			<Suspense fallback={<div style={{ height: "100vh" }}></div>}>
				<NeuronAnimation />
			</Suspense>
			<HomeGradient />
			<Phases
				heading="About CSED?"
				tagline_1="A place where spark"
				tagline_2="turn into stars."
				content="CSED CLUB GLA helps the hustling startups and young
				professionals vía dynamie workshops, thought-provoking speaker
				sessions, high-stakes business plan competitions, and numerous
				other game-changing initiatives throughout the year to create a
				crucible for innovation. We stand as pillars of support for
				budding entrepreneurs, providing them with personalized guidance
				from experienced mentors, crucial funding opportunities, and a
				robust network that can change the course of their journey
				forever!"
			/>
			<Phases
				tagline_1="Where Visionaries Forge Skills &"
				tagline_3="Spark Innovation"
				content=" CSED is a vibrant tapestry of dreamers, doers, and digital pioneers, united by the pursuit of excellence. We don’t just teach skills—we cultivate curiosity, foster fearless creativity, and open doors to boundless opportunities. Whether you aspire to master cutting-edge tech, shape your entrepreneurial journey, or join a thriving community of forward-thinkers."
			/>
			<EventsActivities />
			<Phases
				tagline_1="Join Our Community &"
				tagline_3="Explore the world of innovation"
				content="The CSED Club drives innovation and technological growth within the department. It organizes hackathons, workshops, and speaker sessions to equip students with practical, industry-relevant skills. By fostering collaboration and creativity, the club transforms ideas into impactful projects. Join us to explore, build, and lead in the evolving world of technology."
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					margin: "60px auto",
					padding: "40px 20px",
				}}
			>
				<LightPipeButton />
			</div>
		</>
	);
});

export default Home;
