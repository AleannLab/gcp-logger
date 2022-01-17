let currentPath = __dirname;

module.exports = {
	apps: [
		{
			name: 'logger',
			script: `yarn start:prod`,
			cwd: `${currentPath}/gsp-logger`,
			exec_interpreter: "/home/stupak.alexn/.nvm/versions/node/v10.17.0/bin/node",
			env: {
				NODE_ENV: 'production',
			}
		}
	]
};
