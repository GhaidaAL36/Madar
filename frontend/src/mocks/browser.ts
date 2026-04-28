import { setupWorker } from "msw/browser";
import { jobHandlers } from "./handlers/jobHandlers";

export const worker = setupWorker(...jobHandlers);