const fs = require("fs");
const readline = require("readline");
const Document = require("./document");

const rl = readline.createInterface(process.stdin, process.stdout);

const mainScreen = (error) => {
    process.stdout.write('\033c');
    console.log("========================");
    console.log("Text editor \n");
    console.log("========================");
    console.log("Choose an option: \n");

    if (error === "Not files") {
        console.log("\x1b[31m%s\x1b[0m", "===========================");
        console.log("\x1b[31m%s\x1b[0m", "There are not files to open");
        console.log("\x1b[31m%s\x1b[0m", "=========================== \n");
    }

    console.log("1. Create new file");
    console.log("2. Open file");
    console.log("3. Exit \n");

    const text = error === "Not valid option"
        ? "You have chosen an invalid option, choose a valid option: "
        : "Choose the option number: ";


    rl.question(text, (option) => {
        switch (option) {
            case "1":
                renderFile();
                break;
            case "2":
                openFile();
                break;
            case "3":
                process.exit();

            default:
                mainScreen("Not valid option");
                break
        }
    });
};

const renderFile = (name, content, dir) => {
    const file = new Document(name, content, dir);

    file.render();

    let lastLine = "";

    rl.on("line", (line) => {
        switch (line) {
            case ":q":
                rl.removeAllListeners("line");
                return mainScreen();

            case ":sa":
                lastLine = ":sa";
                return file.saveAs();

            case ":s":
                return file.save();

            default:
                if (lastLine === ":sa") {
                    lastLine = line;
                } else {
                    file.add(line + "\n");
                    lastLine = line;
                }
        }
    })
};

const openFile = (error) => {
    const files = fs.readdirSync("./docs");

    if (files.length === 0) return mainScreen("Not files");

    process.stdout.write('\033c');
    console.log("=========================");
    console.log("Location: /.../docs");
    console.log("=========================");

    files.forEach(file => console.log("    " + file));

    if (error) console.log("\x1b[31m%s\x1b[0m", "\nThe file is not found, please, enter a valid file");

    rl.question("\nFile name to open: ", (name) => {
        if (!(fs.existsSync(`./docs/${name}`))) return openFile("Error");

        const content = fs.readFileSync(`./docs/${name}`);
        const dir = `./docs/${name}`;

        renderFile(name, content.toString(), dir);
    });
}

mainScreen();