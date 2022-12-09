const {
	readFileSync,
	readdirSync,
	mkdirSync,
	writeFileSync,
} = require('node:fs');

const { join: pathJoin } = require('node:path');

class DatabaseError extends Error {}

class Database {
	#name;
	#dirname;

	/**
	 * @param {dirname} string
	 * @param {name} string
	 */
	constructor(location, name) {
		if (!location || !name)
			throw new DatabaseError('No database location or name specified!');

		this.#dirname = location.toString();

		name = name.toString();

		this.#name = name.endsWith('.json') ? name : name.concat('.json');
	}
	/**
	 * @return {Database}
	 */

	/**
	 * @param {key} string
	 * @param {value} any
	 */
	set(key, value) {
		if (!key || !this.#dirname || !this.#name) return this;

		const localdir = readdirSync(process.cwd());

		const dbDirPath = pathJoin(process.cwd(), this.#dirname);

		const dbPath = pathJoin(dbDirPath, this.#name);

		if (localdir.includes(this.#dirname)) {
			const dbDir = readdirSync(dbDirPath);

			if (dbDir.includes(this.#name)) {
				const data = JSON.parse(readFileSync(dbPath), 'utf8');

				data[key] = value ? value : null;

				writeFileSync(dbPath, JSON.stringify(data));
			} else {
				const data = {};

				data[key] = value ? value : null;

				writeFileSync(dbPath, JSON.stringify(data));
			}
		} else {
			mkdirSync(dbDirPath);

			const data = {};

			data[key] = value ? value : null;

			writeFileSync(dbPath, JSON.stringify(data));
		}

		return this;
	}
	/**
	 * @return {Database}
	 */

	/**
	 * @param {key} string
	 */
	get(key) {
		if (!key || !this.#dirname || !this.#name) return this;

		const localdir = readdirSync(process.cwd());

		const dbDirPath = pathJoin(process.cwd(), this.#dirname);

		const dbPath = pathJoin(dbDirPath, this.#name);

		const jsonRegex = new RegExp('^({).+(})$', 'm');

		if (!localdir.includes(this.#dirname)) return null;

		const dbDir = readdirSync(dbDirPath);

		if (!dbDir.includes(this.#name)) return null;

		const data = readFileSync(dbPath);

		if (!jsonRegex.test(data)) return null;

		return data[key];
	}
	/**
	 * @return {any}
	 */

	/**
	 * @param {key} string
	 */
	remove(key) {
		if (!key || !this.#dirname || !this.#name) return this;

		const localdir = readdirSync(process.cwd());

		const dbDirPath = pathJoin(process.cwd(), this.#dirname);

		const dbPath = pathJoin(dbDirPath, this.#name);

		if (!localdir.includes(this.#dirname)) return this;

		const dbDir = readdirSync(dbDirPath);

		if (dbDir.includes(this.#dirname)) return this;

		const data = readFileSync(dbPath, 'utf8');

		delete data[key];

		writeFileSync(dbPath, JSON.stringify(data));
	}
}

module.exports = Database;
