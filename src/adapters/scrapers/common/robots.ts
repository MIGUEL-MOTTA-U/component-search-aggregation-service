import { createRequire } from "node:module";

interface RobotRules {
  isAllowed(url: string, userAgent?: string): boolean | undefined;
}

const require = createRequire(import.meta.url);
const robotsParser = require("robots-parser") as (url: string, robotsTxt: string) => RobotRules;

export interface RobotsClient {
  canFetch(url: string, userAgent: string): Promise<boolean>;
}

export class HttpRobotsClient implements RobotsClient {
  private readonly cache = new Map<string, RobotRules>();

  async canFetch(url: string, userAgent: string): Promise<boolean> {
    const target = new URL(url);
    const origin = target.origin;
    const parser = this.cache.get(origin) ?? (await this.loadParser(origin));
    return parser.isAllowed(url, userAgent) !== false;
  }

  private async loadParser(origin: string): Promise<RobotRules> {
    const robotsUrl = new URL("/robots.txt", origin).toString();
    const response = await fetch(robotsUrl);
    const body = response.ok ? await response.text() : "";
    const parser = robotsParser(robotsUrl, body);
    this.cache.set(origin, parser);
    return parser;
  }
}

export class PermissiveRobotsClient implements RobotsClient {
  async canFetch(_url: string, _userAgent: string): Promise<boolean> {
    return true;
  }
}

