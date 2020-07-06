const process = require('child_process');
const fs = require('fs');
const os = require('os');

if (os.userInfo().username == 'nobody') {
	console.error('The --unsafe-perm option must be used for postinstall script to work.');
	console.error('Please reinstall with that option, or do remaining steps manually:');
	console.error('https://github.com/Sunoo/philips-air#manual-post-install-steps');
} else {
	if (os.platform() == 'linux') {
		try {
			console.log('$ apt-get install -y python3-pip git');
			process.execSync('apt-get install -y python3-pip git', {stdio: 'inherit'});
		} catch (err) {
			console.info(err);
			console.error('Error running apt-get, skipping install. Please ensure pip3 and git are installed.');
		}
	} else {
		console.log('Not running under Linux, not attempting to run apt-get command. Please ensure pip3 and git are installed.');
	}

	console.log();

	try {
		console.log('$ pip3 install -U py-air-control git+https://github.com/Tanganelli/CoAPthon3@89d5173');
		process.execSync('pip3 install -U py-air-control git+https://github.com/Tanganelli/CoAPthon3@89d5173', {stdio: 'inherit'});
	} catch (err) {
		console.info(err);
		console.error('Error running pip3. Please manually install py-air-control and the latest CoAPthon.');
	}

	console.log();

	if (os.platform() == 'linux') {
		try {
			console.log('Checking /etc/sysctl.conf for net.ipv4.ping_group_range...')
			var grep = process.execSync('grep -F net.ipv4.ping_group_range /etc/sysctl.conf').toString().trim();
			console.log('net.ipv4.ping_group_range already set:');
			console.log('\t', grep);
		} catch (err) {
			if (err.status == 1) {
				console.log();

				try {
					console.log('Appending "net.ipv4.ping_group_range=0 1000" to /etc/sysctl.conf...')
					fs.appendFileSync('/etc/sysctl.conf', '\n#Added to allow py-air-control to use the Plain CoAP protocol as non-root.\nnet.ipv4.ping_group_range=0 1000\n');

					try {
						console.log();

						console.log('$ sysctl -p');
						process.execSync('sysctl -p', {stdio: 'inherit'});
						console.log('Reloaded sysctl settings.')
					} catch (err) {
						console.info(err);
						console.error('Error reloading sysctl settings.')
					}
				} catch (err) {
					console.info(err);
					console.error('Error updating sysctl.conf.')
				}
			} else {
				console.info(err);
				console.error('Unknown error running grep.')
			}
		}
	}
}
console.log();