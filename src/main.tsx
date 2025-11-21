import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import App from "./App.tsx";
import i18n from "@/lib/i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<Suspense fallback={<div className="p-8 text-center">Loading translations...</div>}>
		<I18nextProvider i18n={i18n}>
			<App />
		</I18nextProvider>
	</Suspense>
);
