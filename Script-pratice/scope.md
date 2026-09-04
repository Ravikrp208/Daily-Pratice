📘 JavaScript Scope

Scope = kisi variable ko code ke kis part mein access kar sakte hain.

Simple words mein:

Variable kahan available hai, wahi uska scope hai.

JavaScript mein mainly 3 types ke scope hote hain:

Global Scope
Function Scope
Block Scope
1️⃣ Global Scope

Jo variable kisi function ya block ke bahar declare hota hai, wo generally global scope mein hota hai.

let name = "Ravi";

function greet() {
    console.log(name);
}

greet();

console.log(name);

Output:

Ravi
Ravi

name ko function ke andar bhi access kar sakte hain aur bahar bhi.