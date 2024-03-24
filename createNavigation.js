(function () {
const noOp = () => {};
const debug = console.log;
const nextInteger = gen();
const idPrefix = "nav-link-label";

function createNavigation(data, headingLevel = 0) {
/* a line ends with <lf>
- a line begins with a number indicating tree level (distance from root node beginning with 0)
*/

var lines = data.split ("\n");

return	tree2html(importTree(lines), headingLevel);

function importTree (lines, depth = 0) {
//debug("importTree at depth ", depth);
var data = null;
var line = "";
var level = 0;
var label = "";
var href = null;
var node = null;
var tree = [];

line = getNextLine ();
while (line) {
//debug ("importNode from", line, " at depth ", depth);
[level, label, href] = parseLine(line);

if (level === depth) {
tree.push(node = {level, label, href});
//debug("- length=", tree.length);
} else if (level === depth+1) {
lines.unshift(line);
node.children = importTree(lines, depth+1);
} else if (level < depth) {
lines.unshift(line);
break;
} // if

line = getNextLine ();
} // while more lines

//debug ("- returning depth=", depth, "; ", tree);
return tree;
} // importTree

function parseLine (line) {
const splitLine = /^([\d]*)([^=]*)=*(.*)$/;
let data = line.match(splitLine);
const level = (data[1] || 0), label = data[2], href = data[3];
return [Number(level), label, href];
} // parseLine

function getNextLine () {
var line = null;
do {
if (not(lines) || lines.length === 0) return null;
line = lines.shift().trim();
} while (! line);

return line;
} // getNextLine


} // importTreeData

function tree2html (tree, headingLevel = 0) {
// a tree is an array of nodes
// each node is object with properties label and children, where label is a string and children is a tree
// returns a list structure

return `<ul>${tree.map(node2html).join("\n")}</ul>
`;

function node2html (node) {
return  `<li>${node.children?
`${menuTrigger(node.label, headingLevel, node.href)}
${tree2html(node.children, headingLevel > 0? headingLevel+1 : 0)}
` : link(node.label, node.href)}</li>`;
} // node2html

function menuTrigger (label, headingLevel, href) {
//debug(`trigger: ${label}, ${href}, ${headingLevel}\n`);
const id = `${idPrefix}-${nextInteger.next().value}`;
let labelId, link = "";
if (href) {
labelId = id;
link = `<a href="${href}" id="${labelId}">${label}</a>`;
} // if

const button = `<button aria-expanded="false" aria-haspopup="true"
${labelId? `aria-labelledby="${labelId}"` : ""}>
${labelId? ">>" : label}
</button>
`;

const span = `<span role="heading" aria-level="${headingLevel}">`;

if (headingLevel === 0) {
return `${link}\n${button}\n`;
} else if (headingLevel > 0 && link === "") {
return `${span}${button}</span>\n`;
} else if (link && headingLevel > 0) {
return `${span}${link}</span>\n${button}\n`;
} // if

} // menuTrigger

function link (label, href="#") {
return `<a href="${href}">
${label}
</a>
`;
} // link
} // tree2html

function not (x) {return !x;}



function* gen () {
let count = 0;
while (true) {
count += 1;
yield count;
} // while
} // gen

window.createNavigation = createNavigation;
})(window);

