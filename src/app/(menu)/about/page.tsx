"use client";
import React from "react";
import { ArrowLeft, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="w-64 h-85 bg-white rounded-[20px] shadow-lg border border-black relative mx-auto">
      {layout === "grid" && members.length === 4 && (
        <div className="grid grid-cols-2 gap-8 p-8">
          {members.map((member) => (
            <div key={member.name} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-20 h-20 rounded-full shadow-lg mx-auto mb-2"
              />
              <p
                className="text-black text-base"
                style={{ fontFamily: "Hina Mincho, sans-serif" }}
              >
                {member.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {layout === "grid" && members.length === 3 && (
        <div className="p-8">
          <div className="flex justify-around mb-8">
            {members.slice(0, 2).map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full shadow-lg mx-auto mb-2"
                />
                <p
                  className="text-black text-base"
                  style={{ fontFamily: "Hubballi, sans-serif" }}
                >
                  {member.name}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <img
              src={members[2].image}
              alt={members[2].name}
              className="w-20 h-20 rounded-full shadow-lg mx-auto mb-2"
            />
            <p
              className="text-black text-base"
              style={{ fontFamily: "Hubballi, sans-serif" }}
            >
              {members[2].name}
            </p>
          </div>
        </div>
      )}

      {layout === "two" && (
        <div className="flex justify-around items-center h-full px-4">
          {members.map((member) => (
            <div key={member.name} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-20 h-20 rounded-full shadow-lg mx-auto mb-2"
              />
              <p
                className="text-black text-base"
                style={{ fontFamily: "Hubballi, sans-serif" }}
              >
                {member.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {layout === "single" && members[0] && (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <img
              src={members[0].image}
              alt={members[0].name}
              className="w-20 h-20 rounded-full shadow-lg mx-auto mb-2"
            />
            <p
              className="text-black text-base"
              style={{ fontFamily: "Hubballi, sans-serif" }}
            >
              {members[0].name}
            </p>
          </div>
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
    <div className=" bg-violet-50  overflow-hidden mx-auto shadow-2xl pb-8">
      {/* Header */}
      <div className="p-5 flex items-center gap-2">
        <button
          onClick={() => {
            router.back();
          }}
          className="w-5 h-6 bg-cyan-800 flex items-center justify-center rounded hover:bg-cyan-900 transition-colors"
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

      {/* Hero Section with Image */}
      <div className="px-5 mb-1 ml-2">
        <div className="w-full h-40 bg-white rounded-[20px] shadow-lg border border-black relative flex items-center justify-center">
          <div className="text-center">
            <h2
              className="text-cyan-800 text-2xl mb-2 mr-30"
              style={{ fontFamily: "serif" }}
            >
              SkillTrade
            </h2>
            <p
              className="text-black text-base italic mr-30"
              style={{ fontFamily: "Hubballi, sans-serif" }}
            >
              "Grow by giving"
            </p>
          </div>
          <img
            src="about.png"
            alt="SkillTrade"
            className="absolute -right-1 -top-20 w-32 h-59.5 shadow-0 object-cover"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-8 mb-6">
        <h2
          className="text-cyan-800 text-xl mb-4"
          style={{ fontFamily: "serif" }}
        >
          Our mission
        </h2>
        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-6 relative">
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
            anyone to teach what they know and learn what they love. By trading
            skills instead of money, we build a world where growth, creativity,
            and collaboration are open to everyone.
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

        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-5 mb-4">
          <h3
            className="text-cyan-800 text-lg mb-2"
            style={{ fontFamily: "serif" }}
          >
            Community first
          </h3>
          <p
            className="text-black text-base"
            style={{ fontFamily: "Hubballi, sans-serif" }}
          >
            We believe in the power of sharing knowledge and building meaningful
            connections.
          </p>
        </div>

        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-5 mb-4">
          <h3
            className="text-cyan-800 text-lg mb-2"
            style={{ fontFamily: "serif" }}
          >
            Safe & Trusted
          </h3>
          <p
            className="text-black text-base"
            style={{ fontFamily: "Hubballi, sans-serif" }}
          >
            Your safety is our priority. We verify users and moderate all
            exchanges.
          </p>
        </div>

        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-5 mb-4">
          <h3
            className="text-cyan-800 text-lg mb-2"
            style={{ fontFamily: "serif" }}
          >
            Quality Learning
          </h3>
          <p
            className="text-black text-base"
            style={{ fontFamily: "Hubballi, sans-serif" }}
          >
            Every exchange is an opportunity to grow and share your expertise
            with others.
          </p>
        </div>

        <div className="w-full bg-white rounded-[20px] shadow-lg border border-black p-5">
          <h3
            className="text-cyan-800 text-lg mb-2"
            style={{ fontFamily: "serif" }}
          >
            Global Impact
          </h3>
          <p
            className="text-black text-base"
            style={{ fontFamily: "Hubballi, sans-serif" }}
          >
            Breaking down barriers and connecting people across cultures and
            countries.
          </p>
        </div>
      </div>

      {/* Team Sections */}
      <div className="px-8">
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
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
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
