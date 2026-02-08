/**
 * Preloader for heavy OCR and AI post-processing dependencies.
 *
 * Call `preloadAll()` early (e.g. when the OCR modal opens) to kick off
 * dynamic imports and engine initialisation in the background so they are
 * ready (or closer to ready) by the time they are actually needed.
 *
 * Both `preloadTesseract` and `preloadEngine` cache their promises so
 * subsequent calls (including from the consuming components) are free.
 */

export const LLM_MODEL_ID = 'SmolLM2-1.7B-Instruct-q4f16_1-MLC';

// ---------------------------------------------------------------------------
// Tesseract.js
// ---------------------------------------------------------------------------

let tesseractPromise: Promise<typeof import('tesseract.js')> | null = null;

/**
 * Begin loading `tesseract.js`. The returned promise is cached so that the
 * actual consuming component receives the already-resolved module.
 */
export function preloadTesseract(): Promise<typeof import('tesseract.js')> {
	if (!tesseractPromise) {
		tesseractPromise = import('tesseract.js');
	}
	return tesseractPromise;
}

// ---------------------------------------------------------------------------
// @mlc-ai/web-llm engine
// ---------------------------------------------------------------------------

let enginePromise: Promise<import('@mlc-ai/web-llm').MLCEngine> | null = null;

/**
 * Mutable progress callback. The post-processor component can register its
 * own callback so that engine-init progress is forwarded to the UI even
 * though engine creation may have started before the component mounted.
 */
let engineProgressCallback: ((text: string) => void) | null = null;

export function setEngineProgressCallback(cb: ((text: string) => void) | null): void {
	engineProgressCallback = cb;
}

/**
 * Begin loading `@mlc-ai/web-llm` *and* creating the inference engine
 * (which downloads model weights). The promise is cached so every caller
 * shares the same engine instance.
 */
export function preloadEngine(): Promise<import('@mlc-ai/web-llm').MLCEngine> {
	if (!enginePromise) {
		if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
			return Promise.reject(new Error('WebGPU is not supported in this browser.'));
		}

		enginePromise = import('@mlc-ai/web-llm')
			.then(({ CreateMLCEngine }) =>
				CreateMLCEngine(LLM_MODEL_ID, {
					initProgressCallback: (report) => {
						engineProgressCallback?.(report.text);
					}
				})
			)
			.catch((err) => {
				// Reset so a future call can retry instead of returning
				// the same rejected promise forever.
				enginePromise = null;
				throw err;
			});
	}
	return enginePromise;
}

// ---------------------------------------------------------------------------
// Convenience
// ---------------------------------------------------------------------------

/**
 * Kick off all preloads. Failures are intentionally swallowed here – the
 * consuming components will surface errors when they `await` the same
 * cached promises.
 */
export function preloadAll(): void {
	preloadTesseract().catch(() => {});
	preloadEngine().catch(() => {});
}
