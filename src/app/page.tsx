import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Clock, 
  Users, 
  BarChart, 
  Bell,
  CheckCircle,
  MapPin,
} from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span>MAVS Attendance</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container space-y-6 py-12 text-center md:py-24">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Modern Attendance Management
            <br className="hidden sm:inline" />
            Made Simple
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Track attendance, manage departments, and generate reports with ease.
            Perfect for businesses of all sizes.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signin">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12 md:py-24">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Track check-ins and check-outs in real-time with location data
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Department Management</h3>
              <p className="text-muted-foreground">
                Organize employees into departments and manage them efficiently
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Generate comprehensive reports and analyze attendance patterns
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container py-12 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">
                Why Choose MAVS Attendance?
              </h2>
              <p className="text-muted-foreground">
                Our modern attendance system helps you manage your workforce more
                effectively
              </p>
            </div>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-bold">Easy to Use</h4>
                  <p className="text-muted-foreground">
                    Simple and intuitive interface for both employees and managers
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-bold">Location Tracking</h4>
                  <p className="text-muted-foreground">
                    Verify attendance with location data for remote work
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Bell className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-bold">Notifications</h4>
                  <p className="text-muted-foreground">
                    Get alerts for late check-ins and attendance updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MAVS Attendance. All rights reserved.
          </p>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
