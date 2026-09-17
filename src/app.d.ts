// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Minimal typing for the WebMCP imperative API (not yet in lib.dom.d.ts).
	// https://developer.chrome.com/docs/ai/webmcp/imperative-api
	interface ModelContextTool {
		name: string;
		description: string;
		inputSchema: Record<string, unknown>;
		annotations?: {
			readOnlyHint?: boolean;
			untrustedContentHint?: boolean;
			consequentialHint?: boolean;
		};
		execute: (
			args: Record<string, unknown>,
			ctx: { signal: AbortSignal }
		) => Promise<string | null>;
	}

	interface ModelContext extends EventTarget {
		registerTool: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => Promise<void>;
	}

	interface Document {
		modelContext?: ModelContext;
	}
}

export {};
