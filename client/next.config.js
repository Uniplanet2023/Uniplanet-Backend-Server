// next.config.js
module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Modify the config directly
		if (dev) {
			config.watchOptions = {
				poll: 300,
				aggregateTimeout: 300,
			}
		}

		// Important: return the modified config
		return config
	},
}
