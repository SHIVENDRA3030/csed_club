import React from "react";
import GlobalBackgorund from "../components/Team/GlobalBackground";

export default function Newsletter() {
	return (
		<div>
			<div
				style={{
					height: "100vh",
					width: "100vw",
					background: "linear-gradient(135deg, rgba(157, 0, 255, 0.15) 0%, rgba(255, 0, 200, 0.1) 100%)",
					opacity: 0.2,
				}}
			/>
			<div
				className="coming-soon"
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					textAlign: "center",
					color: "#fff",
					fontSize: "3rem",
					fontWeight: "bold",
				}}
			>
				<h1>Coming Soon</h1>
				<span
					style={{
						fontSize: "1.5rem",
						color: "#fff",
						fontWeight: "normal",
						textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
					}}
				>
					Stay tuned for the updates
				</span>
			</div>
		</div>
	);
}
