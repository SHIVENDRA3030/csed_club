// CSEDProjectsGallery.jsx
import React, { useEffect, useState } from "react";
import "./Gallery.css";
import { supabase } from "../supabaseClient";

export default function Gallery(props) {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProjects();
	}, []);

	async function fetchProjects() {
		try {
			// Order by created_at or name if preferred.
			// Since original data order matters, and we just inserted, created_at might be similar.
			// Let's order by created_at desc to show newest (inserted last) first, or just default.
			// Given the manual insert order in SQL, default select * usually returns insertion order (though not guaranteed).
			// Let's assume default for now, can add .order() if needed.
			const { data, error } = await supabase.from("projects").select("*");

			if (error) {
				console.error("Error fetching projects:", error);
			} else {
				setProjects(data);
			}
		} catch (error) {
			console.error("Error fetching projects:", error);
		} finally {
			setLoading(false);
		}
	}

	const toggleDetails = (e) => {
		e.currentTarget.classList.toggle("show-details");
		const img = e.currentTarget.querySelector("img");
		if (img) {
			img.classList.toggle("dimmed");
		}
	};

	if (loading) {
		return <div className="component-container"><p>Loading projects...</p></div>;
	}

	return (
		<div className="component-container">
			<h1 className="gallery-title">{props.title || "{Gallery}"}</h1>
			{projects.map((project, idx) => (
				<div
					className="project-section"
					key={project.id || idx}
					onClick={toggleDetails}
					tabIndex={0}
					aria-label={`Project: ${project.name}`}
				>
					<h2>{project.name}</h2>
					<img src={project.image} alt={project.name} />
					<div className="project-details">
						<p className="desc">{project.description || project.desc}</p>
						<p className="members">
							<strong>Members:</strong>{" "}
							{project.members && project.members.join(", ")}
						</p>
						<p className="members">
							<strong>Mentors:</strong>{" "}
							{project.mentors && project.mentors.join(", ")}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
