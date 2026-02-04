import React from "react";
import "./JoinUsHeader.css";

export default function JoinUsHeader({ onTeamClick }) {
	return (
		<div className="join-us-header-container">
			<div
				className="teamCell"
				onClick={() => onTeamClick("Tech Cell")}
				style={{
					background: `linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)`,
					backgroundSize: "cover",
				}}
			></div>
			<div
				className="teamCell"
				onClick={() => onTeamClick("Operations & Relations")}
				style={{
					background: `linear-gradient(135deg, #059669 0%, #10b981 100%)`,
					backgroundSize: "cover",
				}}
			></div>
			<div
				className="teamCell"
				onClick={() => onTeamClick("Media Cell")}
				style={{
					background: `linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)`,
					backgroundSize: "cover",
				}}
			></div>
		</div>
	);
}
