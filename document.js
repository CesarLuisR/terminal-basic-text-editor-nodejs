const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface(process.stdin, process.stdout);

class Document {
    constructor(name, content, dir) {
        this.name = name || "Untitled";
        this.content = content || "";
        this.dir = dir || "";
    }

    add(text) {
        this.content += text;
    }

    saveAs() {
        if (!(fs.existsSync("./docs"))) {
            fs.mkdirSync("./docs");
        }

        rl.question("\nFile name: ", (name) => {
            this.name = name.toString();
            this.dir = `./docs/${this.name}`;

            fs.writeFileSync(this.dir, this.content);

            this.render(true);
        })
    }

    save() {
        if (this.name === "Untitled") {
            this.saveAs();
        } else {
            fs.writeFileSync(this.dir, this.content);
            this.render();
        }
    }

    render(thenSaveAs) {
        process.stdout.write("\u001b[2J\u001b[0;0H");
        console.log(`| ${this.name} |`);
        console.log("Comands: ( :q => exit | :sa => save as | :s => save )");
        console.log("------------------------------------------------------ \n");
        thenSaveAs && console.log(`File saved as ${this.name}, you can keep editing... \n`);
        console.log(this.content);
    }
}

module.exports = Document;