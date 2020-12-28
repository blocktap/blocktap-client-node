import * as http from "http";
import * as https from "https";
import { RequestError } from "./RequestError";

export type RequestArgs = http.RequestOptions & https.RequestOptions & { json?: any };

export function request<T>({
	protocol,
	hostname,
	port,
	path,
	json,
	headers = {},
	method = "POST",
}: RequestArgs): Promise<T> {
	return new Promise((resolve, reject) => {
		const client = protocol === "https:" ? https : http;
		let payload;

		if (json) {
			payload = JSON.stringify(json);
			const bytes = Buffer.byteLength(payload);
			headers["content-type"] = "application/json";
			headers["content-length"] = bytes;
		}

		const req = client.request({ hostname, port, path, method, headers }, res => {
			const buffers: Buffer[] = [];
			res.on("error", err => reject(err));
			res.on("data", data => buffers.push(data));
			res.on("end", () => {
				const rawBody = Buffer.concat(buffers);
				const statusCode = res.statusCode;
				const body = safeParse(rawBody);
				if (statusCode === 200) {
					resolve(body);
				} else {
					const err = new RequestError(res.statusCode, body);
					reject(err);
				}
			});
		});
		req.on("error", err => reject(err));
		if (payload) {
			req.write(payload);
		}
		req.end();
	});
}

function safeParse(buffer: Buffer): any {
	try {
		return JSON.parse(buffer.toString());
	} catch (ex) {
		return buffer.toString("utf8");
	}
}
