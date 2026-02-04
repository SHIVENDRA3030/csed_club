import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeamHero from "./TeamHero.jsx";
import ProfileCardComponent from "./ProfileCard.jsx";
import GlobalBackground from "./GlobalBackground.jsx";
import "./CSEDClubShowcase.css";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

gsap.registerPlugin(ScrollTrigger);

const CSEDClubShowcase = () => {
	const [showApplicationForm, setShowApplicationForm] = useState(false);
	const [showNavbar, setShowNavbar] = useState(true);
	const [navbarAnimating, setNavbarAnimating] = useState(false);
	const [selectedTeamFilter, setSelectedTeamFilter] = useState(null);
	const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState(null);

	// Supabase data states
	const [mentorData, setMentorData] = useState([]);
	const [teamData, setTeamData] = useState([]);
	const [allMembers, setAllMembers] = useState([]);
	const [loading, setLoading] = useState(true);

	const heroSectionRef = useRef(null);
	const teamsSectionRef = useRef(null);
	const teamsGridRef = useRef(null);
	const teamsHeaderRef = useRef(null);
	const teamsTitleRef = useRef(null);
	const teamsSubtitleRef = useRef(null);

	// Fetch data from Supabase
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch mentors
				const { data: mentorsData, error: mentorsError } = await supabase
					.from("mentors")
					.select("*")
					.order("display_order");

				if (mentorsError) throw mentorsError;
				setMentorData(mentorsData || []);

				// Fetch team members with departments and teams info
				const { data: membersData, error: membersError } = await supabase
					.from("team_members")
					.select(`
						*,
						departments!inner (
							name,
							display_order,
							teams!inner (
								key,
								title,
								display_order
							)
						)
					`)
					.order("display_order");

				if (membersError) throw membersError;

				// Transform data for this component
				const transformedMembers = (membersData || []).map((member) => ({
					name: member.name,
					title: member.title,
					position: member.position,
					avatarUrl: member.avatar_url,
					linkedin: member.linkedin,
					github: member.github,
					teamName: member.departments?.teams?.title,
					teamKey: member.departments?.teams?.key,
					departmentName: member.departments?.name,
					teamDisplayOrder: member.departments?.teams?.display_order || 0,
					deptDisplayOrder: member.departments?.display_order || 0,
					memberDisplayOrder: member.display_order || 0,
				}));

				// Build teamData structure for navbar
				const teamsMap = {};
				transformedMembers.forEach((member) => {
					const teamKey = member.teamKey;
					if (!teamsMap[teamKey]) {
						teamsMap[teamKey] = {
							key: teamKey,
							title: member.teamName,
							members: {},
						};
					}
					const deptName = member.departmentName;
					if (!teamsMap[teamKey].members[deptName]) {
						teamsMap[teamKey].members[deptName] = [];
					}
					teamsMap[teamKey].members[deptName].push(member);
				});
				setTeamData(Object.values(teamsMap));
				setAllMembers(transformedMembers);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useGSAP(() => {
		gsap.fromTo(
			".particle-navbar",
			{
				opacity: 0,
				yPercent: "-100",
			},
			{
				opacity: 1,
				yPercent: 0,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".teams-section",
					start: "top top",
					end: "+=100px",
					scrub: 1,
				},
			}
		);
	});

	useEffect(() => {
		if (loading) return;
		// GSAP Animation for Teams Header
		if (teamsTitleRef.current && teamsSubtitleRef.current) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: teamsHeaderRef.current,
					start: "top 95%",
					end: "bottom 5%",
					toggleActions: "play none none reverse",
					scrub: false,
				},
			});

			tl.fromTo(
				teamsTitleRef.current,
				{ y: 15, opacity: 0.6, scale: 0.98 },
				{ y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power1.out" }
			);

			tl.fromTo(
				teamsSubtitleRef.current,
				{ y: 10, opacity: 0.7 },
				{ y: 0, opacity: 1, duration: 0.4, ease: "power1.out" },
				"-=0.3"
			);

			const highlightWord = teamsSubtitleRef.current.querySelector(".highlight-word");
			if (highlightWord) {
				tl.fromTo(
					highlightWord,
					{ scale: 1 },
					{ scale: 1.02, duration: 0.3, ease: "power1.out", yoyo: true, repeat: 1 },
					"-=0.2"
				);
			}
		}
	}, [loading, selectedTeamFilter, selectedDepartmentFilter]);

	const handleApplyClick = () => {
		setShowApplicationForm(true);
	};

	const closeApplicationForm = () => {
		setShowApplicationForm(false);
	};

	const handleNavbarTeamClick = (teamKey) => {
		const newTeamFilter = selectedTeamFilter === teamKey ? null : teamKey;
		setSelectedTeamFilter(newTeamFilter);
		setSelectedDepartmentFilter(null);

		setTimeout(() => {
			const isFiltering = !!newTeamFilter;
			if (isFiltering && teamsGridRef.current) {
				const navbarHeight = 120;
				const extraOffset = 60;
				const gridPosition = teamsGridRef.current.getBoundingClientRect().top + window.pageYOffset;
				const offsetPosition = gridPosition - navbarHeight - extraOffset;
				window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" });
			} else if (!isFiltering && teamsSectionRef.current) {
				const navbarHeight = 120;
				const extraOffset = 80;
				const elementPosition = teamsSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
				const offsetPosition = elementPosition - navbarHeight - extraOffset;
				window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" });
			}
		}, 250);
	};

	const handleNavbarDepartmentClick = (departmentName) => {
		const newDepartmentFilter = selectedDepartmentFilter === departmentName ? null : departmentName;
		setSelectedDepartmentFilter(newDepartmentFilter);

		setTimeout(() => {
			const isFiltering = !!newDepartmentFilter;
			if (isFiltering && teamsGridRef.current) {
				const navbarHeight = 120;
				const extraOffset = 60;
				const gridPosition = teamsGridRef.current.getBoundingClientRect().top + window.pageYOffset;
				const offsetPosition = gridPosition - navbarHeight - extraOffset;
				window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" });
			} else if (!isFiltering && teamsSectionRef.current) {
				const navbarHeight = 120;
				const extraOffset = 80;
				const elementPosition = teamsSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
				const offsetPosition = elementPosition - navbarHeight - extraOffset;
				window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" });
			}
		}, 250);
	};

	const getGridClassForHierarchy = (position) => {
		switch (position) {
			case "President":
			case "Vice President":
				return "team-card-container hierarchy-executive leader-row executive-row upper-executive";
			case "General Secretary":
			case "Joint Secretary":
				return "team-card-container hierarchy-secretary leader-row secretary-row lower-executive";
			case "Head":
			case "Co-Head":
				return "team-card-container hierarchy-head leader-row";
			default:
				return "team-card-container hierarchy-regular member-row";
		}
	};

	const getAllMembersAlphabetically = () => {
		let filteredMembers = [...allMembers];

		// Apply team filter
		if (selectedTeamFilter) {
			filteredMembers = filteredMembers.filter((m) => m.teamKey === selectedTeamFilter);
		}

		// Apply department filter
		if (selectedDepartmentFilter) {
			filteredMembers = filteredMembers.filter((m) => m.departmentName === selectedDepartmentFilter);
		}

		// Define hierarchy order
		const hierarchyOrder = {
			President: 1,
			"Vice President": 1,
			"General Secretary": 2,
			"Joint Secretary": 2,
			Head: 4,
			"Co-Head": 4,
			default: 5,
		};

		// Sort by hierarchy then alphabetically
		return filteredMembers.sort((a, b) => {
			const aHierarchy = hierarchyOrder[a.position] || hierarchyOrder["default"];
			const bHierarchy = hierarchyOrder[b.position] || hierarchyOrder["default"];

			if (aHierarchy !== bHierarchy) {
				return aHierarchy - bHierarchy;
			}

			return a.name.localeCompare(b.name);
		});
	};

	const getAllDepartments = () => {
		const allDepartments = new Set();

		teamData.forEach((team) => {
			if (!selectedTeamFilter || team.key === selectedTeamFilter) {
				Object.keys(team.members).forEach((departmentName) => {
					allDepartments.add(departmentName);
				});
			}
		});

		return Array.from(allDepartments).sort();
	};

	const ParticleNavbar = ({
		teams,
		departments,
		onTeamClick,
		onDepartmentClick,
		show,
		animating,
		selectedTeamFilter,
		selectedDepartmentFilter,
	}) => {
		return (
			<nav className={`particle-navbar ${show ? "show" : ""} ${animating ? "animating" : ""}`}>
				<div className="navbar-content">
					<div className="teams-nav">
						{teams.map((team) => (
							<button
								key={team.key}
								className={`team-nav-btn ${selectedTeamFilter === team.key ? "active" : ""}`}
								onClick={() => onTeamClick(team.key)}
							>
								{team.title}
							</button>
						))}
					</div>
					{departments.length > 0 && (
						<div className="departments-nav">
							{departments.map((dept) => (
								<button
									key={dept}
									className={`dept-nav-btn ${selectedDepartmentFilter === dept ? "active" : ""}`}
									onClick={() => onDepartmentClick(dept)}
								>
									{dept}
								</button>
							))}
						</div>
					)}
				</div>
			</nav>
		);
	};

	if (loading) {
		return (
			<div className="csed-club-showcase loading-state">
				<GlobalBackground />
				<div className="loading-container">
					<div className="loading-spinner"></div>
					<p>Loading Team Data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="csed-club-showcase">
			<GlobalBackground />

			{/* Particle Navbar */}
			<ParticleNavbar
				teams={teamData}
				departments={getAllDepartments()}
				onTeamClick={handleNavbarTeamClick}
				onDepartmentClick={handleNavbarDepartmentClick}
				show={showNavbar}
				animating={navbarAnimating}
				selectedTeamFilter={selectedTeamFilter}
				selectedDepartmentFilter={selectedDepartmentFilter}
			/>

			{/* Hero Section */}
			<div ref={heroSectionRef} className="hero-section-showcase">
				<TeamHero />
				<div className="scroll-indicator">
					<div className="mouse-icon">
						<div className="mouse-wheel"></div>
					</div>
				</div>
			</div>

			{/* Profile Cards Section */}
			<div ref={teamsSectionRef} className="teams-section">
				<div className="teams-container">
					<div className="teams-header-wrapper">
						<div className="teams-header-container">
							{!(selectedTeamFilter || selectedDepartmentFilter) && (
								<div ref={teamsHeaderRef} className="teams-header">
									<h1 ref={teamsTitleRef} className="teams-main-title">
										<>
											OUR <span className="highlight-word">TEAMS</span>
										</>
									</h1>
									<p ref={teamsSubtitleRef} className="teams-subtitle">
										<>
											WHERE INNOVATION MEETS{" "}
											<span className="highlight-word">EXCELLENCE</span>
										</>
									</p>
								</div>
							)}
							{(selectedTeamFilter || selectedDepartmentFilter) && (
								<div className="show-all-wrapper">
									<button
										onClick={() => {
											setSelectedTeamFilter(null);
											setSelectedDepartmentFilter(null);
										}}
										className="show-all-btn"
									>
										Show All Members
									</button>
								</div>
							)}
						</div>
					</div>

					<div ref={teamsGridRef} className="teams-grid">
						{getAllMembersAlphabetically().map((member, index) => (
							<div
								key={`${member.name}-${index}`}
								className={getGridClassForHierarchy(member.position)}
							>
								<ProfileCardComponent
									member={{
										...member,
										teamName: member.teamName,
										departmentName: member.departmentName,
									}}
									enableTilt={true}
									enableMobileTilt={true}
								/>
							</div>
						))}
					</div>

					<div className="apply-now-wrapper">
						<div className="apply-now-container">
							<button onClick={handleApplyClick} className="apply-now-btn">
								<div className="overline-effect"></div>
								<span>
									<Link to="/join">Apply Now</Link>
								</span>
								<div className="underline-effect"></div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CSEDClubShowcase;
