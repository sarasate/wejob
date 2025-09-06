import { Link } from "@tanstack/react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function HeroUnit() {
	return (
		<div className="relative isolate overflow-hidden bg-white">
			{/* Background decoration */}
			<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
				<div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg]  from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
			</div>

			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					{/* Badge */}
					<div className="mb-8 flex justify-center">
						<Badge
							variant="secondary"
							className="px-4 py-2 text-sm font-medium"
						>
							🚀 Open Source Job Platform
						</Badge>
					</div>

					{/* Main headline */}
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
						Find Your Dream Job with <span className="text-primary">WeJob</span>
					</h1>

					{/* Description */}
					<p className="mt-6 text-lg leading-8 text-gray-600">
						WeJob is an open source job platform that connects talented
						developers, designers, and professionals with innovative companies.
						Built with modern technologies and community-driven development.
					</p>

					{/* CTA Buttons */}
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Button
							size="lg"
							className="px-8 py-3 text-base font-semibold"
							asChild
						>
							<Link to="/jobs">Browse Jobs</Link>
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="px-8 py-3 text-base font-semibold"
							disabled
						>
							Post a Job
						</Button>
					</div>

					{/* Stats */}
					<div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
						<div className="text-center">
							<div className="text-3xl font-bold text-gray-900">0+</div>
							<div className="text-sm text-gray-600">Active Jobs</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-gray-900">1+</div>
							<div className="text-sm text-gray-600">Developers</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-gray-900">100%</div>
							<div className="text-sm text-gray-600">Open Source</div>
						</div>
					</div>

					{/* Features */}
					<div className="mt-16">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
								<span className="text-green-500">✓</span>
								<span>Free to use</span>
							</div>
							<div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
								<span className="text-green-500">✓</span>
								<span>No ads</span>
							</div>
							<div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
								<span className="text-green-500">✓</span>
								<span>Community driven</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom decoration */}
		</div>
	);
}
