import { createFileRoute } from "@tanstack/react-router";
import { HeroUnit } from "../components/HeroUnit";

export const Route = createFileRoute("/")({
	ssr: true,
	component: App,
});

function App() {
	return (
		<div className="text-center">
			<HeroUnit />
		</div>
	);
}
