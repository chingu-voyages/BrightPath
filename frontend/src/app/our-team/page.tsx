"use client";
import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin } from "antd";
import { GitHub, LinkedIn, Link } from "@mui/icons-material";

type TeamMember = {
    id: number;
    name: string;
    role: string;
    profilePicture: string;
    bio: string;
    linkedin?: string;
    github?: string;
    personalWebsite?: string;
};

const OurTeam: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_API_URL + "/team",
                );
                const data = await response.json();
                setTeamMembers(data);
            } catch (error) {
                console.error("Error fetching team members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-center mb-5 text-3xl font-bold">Our Team</h1>
            {loading ? (
                <Spin size="large" className="block mx-auto" />
            ) : (
                <div className="flex flex-wrap gap-8 justify-center">
                    {teamMembers.map((member) => (
                        <Card
                            key={member.id}
                            className="flex flex-col justify-stretch text-center rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl  w-72 h-[550px]"
                            cover={
                                <div className="flex justify-center mt-6">
                                    <Avatar
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/${member.profilePicture}`}
                                        size={150}
                                        className="border-4 border-gray-200"
                                    />
                                </div>
                            }
                        >
                            <h3 className="text-xl font-semibold">
                                {member.name}
                            </h3>
                            <p className="text-gray-500 font-medium italic">
                                {member.role}
                            </p>
                            <div
                                className="text-gray-600"
                                style={{
                                    minHeight: "200px",
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                }}
                            >
                                {member.bio}
                            </div>

                            <div className="flex justify-center gap-4 mt-4">
                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-3xl"
                                    >
                                        <LinkedIn fontSize="inherit" />
                                    </a>
                                )}
                                {member.github && (
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 hover:text-black text-3xl"
                                    >
                                        <GitHub fontSize="inherit" />
                                    </a>
                                )}
                                {member.personalWebsite && (
                                    <a
                                        href={member.personalWebsite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 text-3xl"
                                    >
                                        <Link fontSize="inherit" />
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OurTeam;
