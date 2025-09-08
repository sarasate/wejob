import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "../components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { jobsQueries } from "../services/queries";

export const Route = createFileRoute("/jobs")({
	component: RouteComponent,
	loader: async ({ context }) => {
		return context.queryClient.prefetchQuery(jobsQueries.allJobs());
	},
	pendingComponent: () => {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">Jobs</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }, (_, i) => {
						const skeletonId = `loading-skeleton-${i}`;
						return (
							<Card key={skeletonId} className="animate-pulse">
								<CardHeader>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="h-3 bg-gray-200 rounded"></div>
										<div className="h-3 bg-gray-200 rounded w-5/6"></div>
										<div className="h-3 bg-gray-200 rounded w-4/6"></div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		);
	},
});

function RouteComponent() {
	const { data: jobs, isLoading, error } = useQuery(jobsQueries.allJobs());

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">Jobs</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }, (_, i) => {
						const skeletonId = `loading-skeleton-${i}`;
						return (
							<Card key={skeletonId} className="animate-pulse">
								<CardHeader>
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="h-3 bg-gray-200 rounded"></div>
										<div className="h-3 bg-gray-200 rounded w-5/6"></div>
										<div className="h-3 bg-gray-200 rounded w-4/6"></div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">Jobs</h1>
				<div className="text-center py-12">
					<p className="text-red-500 text-lg">
						Error loading jobs: {error.message}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Jobs</h1>
			{!jobs || jobs.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No jobs found</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{jobs.map((job) => (
						<Card
							key={job.id}
							className="hover:shadow-lg transition-shadow duration-200"
						>
							<CardHeader>
								<div className="flex items-start justify-between">
									<CardTitle className="text-lg line-clamp-2">
										{job.title}
									</CardTitle>
									{job.provider && (
										<Badge variant="secondary" className="ml-2 flex-shrink-0">
											{job.provider}
										</Badge>
									)}
								</div>
								<CardDescription className="text-sm text-gray-600">
									{job.location}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-700 line-clamp-3 mb-4">
									{job.description}
								</p>
								<div className="flex items-center justify-between text-xs text-gray-500">
									<span>
										Posted {new Date(job.createdAt).toLocaleDateString()}
									</span>
									{job.data &&
										typeof job.data === "object" &&
										job.data !== null && (
											<Badge variant="outline" className="text-xs">
												{Object.keys(job.data).length} fields
											</Badge>
										)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
