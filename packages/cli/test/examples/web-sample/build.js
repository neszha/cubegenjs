// Simulate a build for terminal progress.
for (let i = 0; i < 10; i++) {
    setTimeout(function () {
        process.stdout.write(`Build simulation ${i + 1}...`);
    }, i * 100);
}