import { http, HttpResponse, delay } from "msw";
import { mockJobs } from "../data/jobs";

const BASE = "/api/jobs";

export const jobHandlers = [
  // GET /api/jobs
  http.get(BASE, async () => {
    await delay(400); // simulate network
    return HttpResponse.json(mockJobs);
  }),

  // GET /api/jobs/:id
  http.get(`${BASE}/:id`, async ({ params }) => {
    await delay(400);
    const job = mockJobs.find((j) => j.id === params.id);
    if (!job) return HttpResponse.json({ message: "الوظيفة غير موجودة" }, { status: 404 });
    return HttpResponse.json(job);
  }),
];