const fs = require("fs");
const readline = require("readline");
const Document = require("./document");
const messages = require("./messages");

const readlineInterface = readline.createInterface(process.stdin, process.stdout);

const mainScreen = (error) => {
  process.stdout.write('\033c');
  console.log(messages.mainScreenHeader);

  if (error === "Not files")
    console.log("\x1b[31m%s\x1b[0m", messages.mainScreenNotFilesError);

  console.log(messages.mainScreenChoice);

  const text = error === "Not valid option"
    ? "You have chosen an invalid option, choose a valid option: "
    : "Choose the option number: ";

  readlineInterface.question(text, (option) => {
    switch (option) {
      case "1":
        return renderFile();

      case "2":
        return openFile();

      case "3":
        return process.exit();

      default:
        return mainScreen("Not valid option");
    }
  });
};

const renderFile = (name, content, dir) => {
  const file = new Document(name, content, dir);
  let lastLine = "";

  file.render();

  readlineInterface.on("line", (line) => {
    switch (line) {
      case ":q":
        readlineInterface.removeAllListeners("line");
        return mainScreen();

      case ":sa":
        lastLine = ":sa";
        return file.saveAs();

      case ":s":
        return file.save();

      default:
        if (lastLine === ":sa") lastLine = line;
        else {
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
  console.log(messages.openFileLocationHeader);
  files.forEach(file => console.log("    " + file));

  if (error)
    console.log("\x1b[31m%s\x1b[0m", "\nThe file is not found, please, enter a valid file");

  readlineInterface.question("\nFile name to open: ", (name) => {
    if (!(fs.existsSync(`./docs/${name}`))) return openFile("Error");
    const content = fs.readFileSync(`./docs/${name}`);

    renderFile(name, content.toString(), `./docs/${name}`);
  });
}

mainScreen();