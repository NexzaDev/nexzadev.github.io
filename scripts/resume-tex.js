const escapeTex = (value) =>
   String(value)
      .replaceAll("\\", "\\textbackslash{}")
      .replaceAll("&", "\\&")
      .replaceAll("%", "\\%")
      .replaceAll("$", "\\$")
      .replaceAll("#", "\\#")
      .replaceAll("_", "\\_")
      .replaceAll("{", "\\{")
      .replaceAll("}", "\\}");

const textOf = (nodes = []) =>
   nodes
      .map((node) => (typeof node === "string" ? node : textOf(node.c ?? [])))
      .join("");

export const toResumeTex = (cv) => {
   const sections = cv.sections
      .map((section) => {
         const blocks = section.blocks
            .map((block) => {
               if (block.t === "para") return escapeTex(textOf(block.c));
               if (block.t === "list")
                  return `\\begin{itemize}\n${block.items.map((item) => `\\item ${escapeTex(textOf(item.c))}`).join("\n")}\n\\end{itemize}`;
               if (block.t === "entry")
                  return `\\textbf{${escapeTex(textOf(block.title))}} — ${escapeTex(textOf(block.subtitle))}\\\\\n${block.items.map((item) => `\\begin{itemize}\\item ${escapeTex(textOf(item))}\\end{itemize}`).join("\n")}`;
               return "";
            })
            .filter(Boolean)
            .join("\n\n");
         return `\\section*{${escapeTex(section.title)}}\n${blocks}`;
      })
      .join("\n\n");
   return `\\documentclass{article}\n\\begin{document}\n\\begin{center}\\LARGE ${escapeTex(cv.header.name)}\\end{center}\n${sections}\n\\end{document}\n`;
};
