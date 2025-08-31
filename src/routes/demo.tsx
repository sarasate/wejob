import { createFileRoute } from "@tanstack/react-router";
import DemoHeader from "../components/DemoHeader";

export const Route = createFileRoute("/demo")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<DemoHeader />
		</div>
	);
}
