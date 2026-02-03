
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EventFeature from "../components/events/EventFeature";
import EventCardsStack from "../components/events/EventCardsStack";
import CompletedEventCard from "../components/events/CompletedEventCard";
import EventHero from "../components/events/EventHero";
import ScrollRevealText from "../components/events/ScrollRevealText.jsx";
import HorizontalEventBar from "../components/events/horizontalEventBar";
import { supabase } from "../supabaseClient";

export default function App() {
	const [eventData, setEventData] = useState(null);
	const [events, setEvents] = useState([]);
	const [completedEvents, setCompletedEvents] = useState([]);
	const [horizontalEventData, setHorizontalEventData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const [
					{ data: upcomingData },
					{ data: completedData },
					{ data: calendarData },
					{ data: pageContentData }
				] = await Promise.all([
					supabase.from("upcoming_events").select("*"),
					supabase.from("completed_events").select("*"),
					supabase.from("calendar_events").select("*"),
					supabase.from("page_content").select("content").eq("key", "events_hero").single()
				]);

				if (upcomingData) setEvents(upcomingData);
				if (completedData) setCompletedEvents(completedData);
				if (calendarData) setHorizontalEventData(calendarData);
				if (pageContentData) setEventData(pageContentData.content);

			} catch (error) {
				console.error("Error fetching event data:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const HorizontalRegisterButtonText = "Coming Soon";

	if (loading) {
		return <div className="flex items-center justify-center h-screen bg-black text-white text-xl">Loading Events...</div>;
	}

	return (
		<div className="App events-theme-bg">
			{/* Consistent theme background, removed extra shapes */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="true"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
				rel="stylesheet"
			/>
			<script src="https://cdn.tailwindcss.com"></script>
			<EventHero />
			{eventData && (
				<EventFeature
					imageUrl={eventData.imageUrl}
					videoUrl={eventData.videoUrl}
					heading={eventData.heading}
					subheading={eventData.subheading}
					description={eventData.description}
					stats={eventData.stats}
				/>
			)}
			<main className="content-wrapper">
				<ScrollRevealText>
					<h2>Upcoming Events</h2>
					<p>Discover amazing experiences waiting for you</p>
				</ScrollRevealText>
			</main>
			<EventCardsStack
				events={events}
				particleCount={30} // Always show particles (dots)
				categoryColors={events.categoryColors}
			/>
			<main className="content-wrapper">
				<ScrollRevealText>
					<h2>Completed Events</h2>
					<p>
						Explore the highlights and memories from our past events
					</p>
				</ScrollRevealText>
			</main>
			<div style={{ marginTop: "6rem" }}>
				{" "}
				{/* New wrapper div for spacing */}
				<div className="events-grid-container">
					{/* Removed individual background shapes from here, now handled globally */}

					{completedEvents.map((event, index) => (
						<CompletedEventCard
							key={event.id || index}
							completedEvent={event}
						/>
					))}
				</div>
			</div>
			<main className="content-wrapper">
				<ScrollRevealText>
					<h2>Event Calendar Of The Month</h2>
					<p>
						Stay updated with our event calendar for the month of
						August 2025
					</p>
				</ScrollRevealText>
			</main>
			<HorizontalEventBar
				events={horizontalEventData}
				buttonText={HorizontalRegisterButtonText}
			/>
		</div>
	);
}
