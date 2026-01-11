"use client";

import React from "react";
import { ArrowLeft, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust path based on your project structure

type TeamMember = {
  name: string;
  image: string;
};

type TeamCardLayout = "grid" | "two" | "single";

type TeamCardProps = {
  title: string;
  subtitle: string;
  members: TeamMember[];
  layout?: TeamCardLayout;
};

// Helper to get initials for the Avatar Fallback
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const TeamMemberItem: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="text-center">
    <Avatar className="w-20 h-20 shadow-lg mx-auto mb-2 border border-slate-100">
      <AvatarImage
        src={member.image}
        alt={member.name}
        className="object-cover"
      />
      <AvatarFallback className="bg-cyan-100 text-cyan-800 font-medium">
        {getInitials(member.name)}
      </AvatarFallback>
    </Avatar>
    <p
      className="text-black text-sm md:text-base"
      style={{ fontFamily: "Hina Mincho, sans-serif" }}
    >
      {member.name}
    </p>
  </div>
);

const TeamCard: React.FC<TeamCardProps> = ({
  title,
  subtitle,
  members,
  layout = "grid",
}) => (
  <div className="mb-8">
    <h3
      className="text-cyan-800 text-xl text-center mb-1"
      style={{ fontFamily: "serif" }}
    >
      {title}
    </h3>
    <p
      className="text-cyan-800 text-base text-center mb-4"
      style={{ fontFamily: "serif" }}
    >
      {subtitle}
    </p>

    <div className="w-64 min-h-[340px] bg-white rounded-[20px] shadow-lg border border-black relative mx-auto flex flex-col justify-center">
      {/* Grid Layout for 4 members */}
      {layout === "grid" && members.length === 4 && (
        <div className="grid grid-cols-2 gap-6 p-6">
          {members.map((member) => (
            <TeamMemberItem key={member.name} member={member} />
          ))}
        </div>
      )}

      {/* Grid Layout for 3 members */}
      {layout === "grid" && members.length === 3 && (
        <div className="p-6">
          <div className="flex justify-around mb-6">
            {members.slice(0, 2).map((member) => (
              <TeamMemberItem key={member.name} member={member} />
            ))}
          </div>
          <div className="flex justify-center">
            <TeamMemberItem member={members[2]} />
          </div>
        </div>
      )}

      {/* Two Member Layout */}
      {layout === "two" && (
        <div className="flex justify-around items-center px-4">
          {members.map((member) => (
            <TeamMemberItem key={member.name} member={member} />
          ))}
        </div>
      )}

      {/* Single Member Layout */}
      {layout === "single" && members[0] && (
        <div className="flex justify-center items-center">
          <TeamMemberItem member={members[0]} />
        </div>
      )}
    </div>
  </div>
);

export default function AboutSkillTrade() {
  const router = useRouter();

  const developers: TeamMember[] = [
    { name: "Sebastian Ciocan", image: "Sebi.png" },
    { name: "Iuliana Roman", image: "sandra.png" },
    { name: "Răzvan Juncu", image: "razvan.png" },
    { name: "Alexandru Geaboc", image: "alex.png" },
  ];

  const webDesigners: TeamMember[] = [
    { name: "Elena Rusu", image: "Elena.png" },
    { name: "Andreea Crauciuc", image: "crauciuc.png" },
    { name: "Ioana Crudu", image: "Ioana.png" },
  ];

  const dataAnalysts: TeamMember[] = [
    { name: "Adelina Craciun", image: "adelina.png" },
    { name: "Iasmina Lăcureanu", image: "iasmina.png" },
  ];

  const marketingBA: TeamMember[] = [
    { name: "Camelia Costraș", image: "camelia.png" },
    { name: "Andreea Băhnăreanu", image: "andreea.png" },
  ];

  const scrumMaster: TeamMember[] = [
    { name: "Serafim Hărmănescu", image: "serafim.png" },
  ];

  return (
    <div className="bg-violet-50 overflow-hidden mx-auto shadow-2xl pb-8">
      {/* Header */}
      <div className="p-5 flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 bg-cyan-800 flex items-center justify-center rounded hover:bg-cyan-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1
          className="text-cyan-800 text-base font-medium"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          About SkillTrade
        </h1>
      </div>

      {/* Hero Section */}
      <div className="px-5 mb-1 ml-2">
        <div className="w-full h-40 bg-white rounded-[20px] shadow-lg border border-black relative flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <h2
              className="text-cyan-800 text-2xl mb-2"
              style={{ fontFamily: "serif" }}
            >
              SkillTrade
            </h2>
            <p
              className="text-black text-base italic"
              style={{ fontFamily: "Hubballi, sans-serif" }}
            >
              "Grow by giving"
            </p>
          </div>
          <img
            src="about.png"
            alt="SkillTrade"
            className="absolute -right-1 -top-10 w-32 h-auto object-cover opacity-80"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-8 mb-6 mt-8">
        <h2
          className="text-cyan-800 text-xl mb-4"
          style={{ fontFamily: "serif" }}
        >
          Our mission
        </h2>
        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-6">
          <div className="w-36 h-0.5 bg-cyan-800 mx-auto mb-4"></div>
          <p
            className="text-black text-base leading-relaxed"
            style={{ fontFamily: "Hubballi, sans-serif" }}
          >
            At SkillTrade, we believe that knowledge is the world's most
            valuable currency — and everyone has something worth sharing.
            <br />
            <br />
            Our mission is to connect people through skill exchange — empowering
            anyone to teach what they know and learn what they love.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-8 mb-6">
        <h2
          className="text-cyan-800 text-xl mb-4"
          style={{ fontFamily: "serif" }}
        >
          Our values
        </h2>
        {[
          {
            title: "Community first",
            text: "We believe in the power of sharing knowledge and building meaningful connections.",
          },
          {
            title: "Safe & Trusted",
            text: "Your safety is our priority. We verify users and moderate all exchanges.",
          },
          {
            title: "Quality Learning",
            text: "Every exchange is an opportunity to grow and share your expertise.",
          },
          {
            title: "Global Impact",
            text: "Breaking down barriers and connecting people across cultures.",
          },
        ].map((value) => (
          <div
            key={value.title}
            className="w-full bg-white rounded-[20px] shadow-lg border border-black p-5 mb-4"
          >
            <h3
              className="text-cyan-800 text-lg mb-2"
              style={{ fontFamily: "serif" }}
            >
              {value.title}
            </h3>
            <p
              className="text-black text-base"
              style={{ fontFamily: "Hubballi, sans-serif" }}
            >
              {value.text}
            </p>
          </div>
        ))}
      </div>

      {/* Team Sections */}
      <div className="px-8 space-y-4">
        <TeamCard
          title="Meet the team"
          subtitle="Developers"
          members={developers}
          layout="grid"
        />
        <TeamCard
          title="Meet the team"
          subtitle="Web Designers"
          members={webDesigners}
          layout="grid"
        />
        <TeamCard
          title="Meet the team"
          subtitle="Data Analysts"
          members={dataAnalysts}
          layout="two"
        />
        <TeamCard
          title="Meet the team"
          subtitle="Marketing & BA"
          members={marketingBA}
          layout="two"
        />
        <TeamCard
          title="Meet the team"
          subtitle="Scrum Master"
          members={scrumMaster}
          layout="single"
        />
      </div>

      {/* Instagram Section */}
      <div className="px-8 mt-8">
        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-6 text-center">
          <h3
            className="text-cyan-800 text-2xl mb-4"
            style={{ fontFamily: "serif" }}
          >
            Meet us on Instagram
          </h3>
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Instagram className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <a
            href="https://instagram.com/joinskilltrade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-base underline hover:text-cyan-800 transition-colors"
            style={{ fontFamily: "Hubballi, sans-serif" }}
          >
            @joinskilltrade
          </a>
        </div>
      </div>
    </div>
  );
}
