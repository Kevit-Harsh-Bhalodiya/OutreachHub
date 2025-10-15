import PrimaryButton from "./PrimaryButton";
import {
  Users,
  MessageSquare,
  Target,
  ChartColumn,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import { selectTheme } from "../redux/slices/ThemeSwitcher";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const Hero = () => {
  const currentTheme = useSelector<RootState, "light" | "dark">(selectTheme);
  return (
    <div
      className={`flex flex-col gap-8 text-white`}
    >
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[65vh] overflow-hidden z-10 relative">
          <img
            src="background.gif"
            // src=" ../../public/background.gif"

//
            alt="Background"
            className="absolute w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-lg z-[1]"></div>
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[65vh] overflow-hidden z-10 relative">
        <h1 className="text-7xl font-bold">
          Scale your{" "}
          <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
            Outreach
          </span>
          <br />
          Like Never Before
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300 font-[400] pb-8">
          OutreachHub empowers businesses to connect with their audience through
          intelligent automation, personalized campaigns, and data-driven
          insights
        </p>
        <div className="flex gap-8">
          <PrimaryButton name="Learn more" onClick={() => {}} />
        </div>
        </div>
      </section>
      <StatsSection  currentTheme={currentTheme}/>
      <FeaturesHeader currentTheme={currentTheme} />
      <FeaturesGrid currentTheme={currentTheme} />
      <CTASection  currentTheme={currentTheme}/>
    </div>
  );
};

export default Hero;
type StatsSectionProps = {
  currentTheme: "light" | "dark";
} 
function StatsSection(props: StatsSectionProps) {
  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "1M+", label: "Messages Sent" },
    { value: "94%", label: "Success Rate" },
    { value: "50+", label: "Countries" },
  ];

  return (
    <section className={`py-16 border-b-gray-800  ${props.currentTheme==='light'?`bg-[#fafafa]`:`bg-[#08080a]`}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-purple-500">
                {stat.value}
              </div>
              <div className="text-m text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function FeaturesHeader(props:StatsSectionProps) {
  return (
    <div className="text-center mb-16">
      <h2
        className={`text-4xl font-bold mb-4 ${props.currentTheme === "light" ? `text-black` : `text-white`}`}
      >
        Everything You Need to Succeed
      </h2>
      <p className="text-xl max-w-2xl mx-auto text-gray-400">
        Our comprehensive platform provides all the tools you need to create,
        manage, and optimize your outreach campaigns.
      </p>
    </div>
  );
}

const features = [
  {
    icon: Users,
    title: "Contact Management",
    description:
      "Organize and manage your contacts with powerful tagging and filtering systems.",
  },
  {
    icon: MessageSquare,
    title: "Message Templates",
    description:
      "Create reusable templates for emails, SMS, and social media outreach.",
  },
  {
    icon: Target,
    title: "Smart Campaigns",
    description:
      "Launch targeted campaigns with advanced segmentation and automation.",
  },
  {
    icon: ChartColumn,
    title: "Analytics & Insights",
    description:
      "Track performance with detailed analytics and conversion metrics.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Automate your outreach workflow to save time and increase efficiency.",
  },
  {
    icon: Shield,
    title: "Compliance Ready",
    description:
      "Built-in compliance features for GDPR, CAN-SPAM, and other regulations.",
  },
];
function FeaturesGrid(props:StatsSectionProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${props.currentTheme==='light'?`text-black`:`text-white`}`}>
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className="rounded-lg text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-[var(--gradient-card)]"
          >
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className={`h-12 w-12 rounded-lg ${props.currentTheme==='light'?`bg-[#EFEAFA]`:`bg-[#171124]`}   flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-primary text-purple-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-xl">
                {feature.title}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-muted-foreground text-base">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CTASection(props:StatsSectionProps) {
  return (
    <section className={`py-24 ${props.currentTheme==='light'?`text-black bg-[#FAFAFA]`:`text-white bg-[#08080a]`}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Outreach?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-gray-400">
          Join thousands of businesses already using OutreachHub to grow their
          reach and engagement.
        </p>
        <a
          href="/campaigns"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md text-lg px-8"
        >
          Get Started Today
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
