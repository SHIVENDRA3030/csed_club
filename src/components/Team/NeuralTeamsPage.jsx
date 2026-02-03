import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./NeuralTeamsPage.css";

gsap.registerPlugin(ScrollTrigger);

const NeuralTeamsPage = () => {


    const heroSubtitleRef = useRef(null);
    const neuralAnimationRef = useRef(null);

    const [mentors, setMentors] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setMentors(mentorsData || []);

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

                // Transform data for easier use
                const transformedMembers = (membersData || []).map((member) => ({
                    ...member,
                    departmentName: member.departments?.name,
                    teamKey: member.departments?.teams?.key,
                    teamTitle: member.departments?.teams?.title,
                    role: member.departments?.teams?.key || "tech",
                }));

                // Sort by team order, department order, then member order
                transformedMembers.sort((a, b) => {
                    const teamOrderA = a.departments?.teams?.display_order || 0;
                    const teamOrderB = b.departments?.teams?.display_order || 0;
                    if (teamOrderA !== teamOrderB) return teamOrderA - teamOrderB;

                    const deptOrderA = a.departments?.display_order || 0;
                    const deptOrderB = b.departments?.display_order || 0;
                    if (deptOrderA !== deptOrderB) return deptOrderA - deptOrderB;

                    return (a.display_order || 0) - (b.display_order || 0);
                });

                setTeamMembers(transformedMembers);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    // Neural background canvas effect
    useEffect(() => {
        let isMounted = true;
        let checkAttempts = 0;
        const maxAttempts = 50; // Max 5 seconds of checking (50 * 100ms)

        const initializeCanvas = async () => {
            // Wait for canvas element to be available in DOM
            while (checkAttempts < maxAttempts && !document.getElementById('neuralCanvas')) {
                await new Promise(resolve => setTimeout(resolve, 100));
                checkAttempts++;
            }

            if (!isMounted || !document.getElementById('neuralCanvas')) {
                return;
            }

            try {
                // Dynamic import to avoid SSR issues
                const { default: NeuralNetworkAnimation } = await import('./NeuralNetworkAnimation');

                const neuralNetwork = new NeuralNetworkAnimation('neuralCanvas', {
                    particleCount: 100,
                    particleColor: 'rgba(0, 243, 255, 0.6)',
                    lineColor: '0, 243, 255',
                    maxDistance: 150,
                    particleSpeed: 0.5,
                    maxParticleSize: 2.5,
                    lineWidth: 0.8,
                    backgroundColor: '#05070a'
                });

                neuralAnimationRef.current = neuralNetwork;
            } catch (error) {
                console.error('Failed to initialize neural network animation:', error);
            }
        };

        initializeCanvas();

        return () => {
            isMounted = false;
            if (neuralAnimationRef.current) {
                neuralAnimationRef.current.destroy();
                neuralAnimationRef.current = null;
            }
        };
    }, []);

    // Typewriter effect for hero subtitle
    useEffect(() => {
        const subtitle = heroSubtitleRef.current;
        if (!subtitle) return;

        const text = "> WHERE INNOVATION MEETS EXCELLENCE";
        subtitle.innerText = "";
        subtitle.style.opacity = 1;

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }, []);

    // GSAP Animations - only subtle effects, no hiding
    useEffect(() => {
        if (loading) return;

        // Cards are already visible, just add subtle entrance animation
        gsap.set(".team-card-neural", { opacity: 1, scale: 1 });
        gsap.set(".mentor-card", { opacity: 1, y: 0 });
    }, [loading]);

    // 3D parallax effect for mentor cards
    useEffect(() => {
        if (loading) return;

        const cards = document.querySelectorAll(".mentor-card");
        cards.forEach((card) => {
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            };

            const handleMouseLeave = () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
            };

            card.addEventListener("mousemove", handleMouseMove);
            card.addEventListener("mouseleave", handleMouseLeave);
        });
    }, [loading]);

    const getRoleTag = (role) => {
        const roleLabels = {
            tech: "DEVELOPER",
            media: "VISUALS",
            operations: "LOGISTICS",
            leadership: "STRATEGY",
        };
        return roleLabels[role] || "MEMBER";
    };

    if (loading) {
        return (
            <div className="neural-teams-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>INITIALIZING NEURAL NETWORK...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="neural-teams-page">

            {/* Noise Overlay */}
            <div className="noise-overlay"></div>

            {/* Neural Background Canvas */}
            <canvas id="neuralCanvas" aria-hidden="true"></canvas>

            <div className="container-neural">
                {/* Hero Section */}
                <section className="hero-neural">
                    <div className="hero-content-neural">
                        <h1 className="hero-title-neural">CSED CLUB – TEAMS</h1>
                        <p ref={heroSubtitleRef} className="hero-subtitle-neural"></p>
                    </div>
                    <div className="system-status">
                        NODE_ACTIVE: CORE_SERVER_01<br />
                        LATENCY: 12ms<br />
                        ENCRYPTION: AES-256-GCM
                    </div>
                </section>

                {/* Mentors Section */}
                <div className="section-label">PRIMARY_NODES // MENTORS</div>
                <section className="mentors-grid-neural">
                    {mentors.map((mentor, index) => (
                        <div className="mentor-card" key={mentor.id || index}>
                            <div className="hologram-frame mentor-hologram">
                                <div className="scan-line"></div>
                                {mentor.avatar_url ? (
                                    <img
                                        src={mentor.avatar_url}
                                        alt={mentor.name}
                                        className="mentor-image"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                        }}
                                    />
                                ) : null}
                                <div className="placeholder-content" style={{ display: mentor.avatar_url ? "none" : "flex" }}>
                                    <svg className="ai-mesh" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="0.5"
                                            strokeDasharray="2 2"
                                        />
                                        <path
                                            d="M30 40 Q50 10 70 40 Q50 70 30 40"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                        />
                                        <circle
                                            cx="50"
                                            cy="45"
                                            r="15"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="0.5"
                                        />
                                    </svg>
                                    <p>IDENTITY PENDING</p>
                                </div>
                            </div>
                            <h3>{mentor.name}</h3>
                            <p className="mentor-role">{mentor.title}</p>
                            {mentor.linkedin && (
                                <a
                                    href={mentor.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    LINKEDIN
                                </a>
                            )}
                        </div>
                    ))}
                </section>

                {/* Team Members Section */}
                <div className="section-label">CLUSTER_NODES // TEAM_MEMBERS</div>
                <section className="team-grid-neural">
                    {teamMembers.map((member, index) => (
                        <div className="team-card-neural" key={member.id || index}>
                            <div className="hologram-frame team-hologram">
                                <div className="scan-line"></div>
                                {member.avatar_url ? (
                                    <img
                                        src={member.avatar_url}
                                        alt={member.name}
                                        className="member-image"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                        }}
                                    />
                                ) : null}
                                <div className="placeholder-content" style={{ display: member.avatar_url ? "none" : "flex" }}>
                                    <p style={{ fontSize: "0.5rem" }}>FACE MODEL LOADING</p>
                                    <div
                                        style={{
                                            width: "20px",
                                            height: "1px",
                                            background: "var(--accent-cyan)",
                                            margin: "10px auto",
                                            opacity: 0.5,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <h4 className="member-name">{member.name}</h4>
                            <p className="member-title">{member.title}</p>
                            <p className="member-department">{member.departmentName}</p>
                            <div className={`tag tag-${member.role || "tech"}`}>
                                {getRoleTag(member.role)}
                            </div>
                            <div className="member-links">
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                )}
                                {member.github && (
                                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                {/* CTA Section */}
                <section className="cta-section-neural">
                    <Link to="/join" className="terminal-btn">
                        JOIN_NETWORK --execute
                    </Link>
                </section>

                {/* Footer */}
                <footer className="footer-neural">
                    <div>
                        <span className="status-dot"></span> SYSTEM ONLINE // V.2.0.4-BETA
                    </div>
                    <div className="social-links-neural">
                        <a href="https://github.com/csed-club" target="_blank" rel="noopener noreferrer">
                            GITHUB
                        </a>
                        <a
                            href="https://linkedin.com/company/csed-club"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LINKEDIN
                        </a>
                        <a
                            href="https://instagram.com/csed_club"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            INSTAGRAM
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default NeuralTeamsPage;
