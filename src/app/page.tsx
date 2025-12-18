import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Handshake,
  Sparkles,
  ArrowRight,
  Shield,
  Trophy,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Handshake className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-3">SkillTrade</h1>
          <p className="text-lg text-muted-foreground">
            Connect. Learn. Grow Together.
          </p>
        </div>

        {/* Tagline */}
        <p className="text-foreground/80 text-center mb-8">
          Teach what you know, learn what you don&apos;t. Build meaningful
          connections through knowledge exchange.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mb-12">
          <Button asChild size="lg" className="rounded-full py-6 text-base">
            <Link href="/auth">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full py-6 text-base"
          >
            <Link href="/discover">
              <Users className="mr-2 w-5 h-5" />
              Explore Community
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <CardTitle className="text-lg">Smart Matching</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find perfect partners for skill exchange based on your goals and
                expertise.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <CardTitle className="text-lg">Verified Community</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All users are verified for a safe and trustworthy learning
                environment.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your learning journey and build a portfolio of verified
                skills.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center text-primary mb-6">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Profile</h3>
                <p className="text-sm text-muted-foreground">
                  List your skills and learning goals. Get verified to build
                  trust.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Find Match</h3>
                <p className="text-sm text-muted-foreground">
                  Get connected with perfect partners for mutual skill exchange.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Start Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule sessions, track progress, and grow your skills
                  together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-muted/30 px-6 py-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">1,000+</div>
            <div className="text-xs text-muted-foreground">Active Learners</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary mb-1">500+</div>
            <div className="text-xs text-muted-foreground">Skills Shared</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent mb-1">98%</div>
            <div className="text-xs text-muted-foreground">Satisfaction</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-8">
        <div className="text-center">
          <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary mb-3">
            Start Your Skill Journey
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our community of learners and teachers today.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base"
          >
            <Link href="/auth">
              Join SkillTrade
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
