import type { FastifyReply, FastifyRequest } from "fastify";

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export function problemDetails(status: number, title: string, detail: string, request: FastifyRequest): ProblemDetails {
  return {
    type: "about:blank",
    title,
    status,
    detail,
    instance: request.url
  };
}

export async function errorHandler(error: Error & { statusCode?: number; validation?: unknown }, request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const status = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
  const title = status === 500 ? "Internal Server Error" : "Bad Request";
  await reply.status(status).type("application/problem+json").send(problemDetails(status, title, error.message, request));
}

