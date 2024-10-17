// import 'cg.protector.js'

for (let i = 0; i < 10; i++) {
    setTimeout(function () {
        process.stdout.write(`Build simulation ${i + 1}...`);
    }, i * 250);
}