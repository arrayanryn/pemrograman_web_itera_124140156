/* Tes modul latihan: jalankan semua fungsi demo murni dari app.js di Node (ESM). */
import {
  demoVariables, demoArrowFunctions, demoTemplateLiterals, demoDestructuring,
  demoSpreadRest, demoDefaultParams, demoClasses, demoObjectLiterals,
  demoArrayMethods, demoAdvancedArrays,
} from "../modul/js/app.js";

let lulus = 0, gagal = 0;
const cek = (judul, kondisi) => {
  if (kondisi) { lulus++; console.log(`  PASS  ${judul}`); }
  else { gagal++; console.log(`  FAIL  ${judul}`); }
};

console.log("== DEMO 1: VARIABLES ==");
const v = demoVariables();
cek("var bocor keluar block", v.oldVar === "Changed inside block");
cek("let block-scoped (tidak tertimpa)", v.newLet === "New let variable");
cek("const PI utuh", v.PI === 3.14159);
cek("isi objek const bisa diubah", v.user.age === 31);

console.log("== DEMO 2: ARROW ==");
const a = demoArrowFunctions();
cek("regularSum(5,3)=8", a.regularSum === 8);
cek("arrowSum = regularSum", a.arrowSum === 8);
cek("shortArrow implicit return", a.shortArrowSum === 8);
cek("tanpa param", a.sayHello === "Hello World!");
cek("satu param tanpa kurung", a.square === 16);

console.log("== DEMO 3: TEMPLATE LITERALS ==");
const t = demoTemplateLiterals();
cek("oldWay concat", t.oldWay === "Nama saya John dan umur saya 30 tahun.");
cek("newWay identik dengan oldWay", t.newWay === t.oldWay);
cek("ekspresi di dalam template", t.expression === `Tahun lahir: ${new Date().getFullYear() - 30}`);
cek("multi-line mengandung nama", t.multiLine.includes("John"));

console.log("== DEMO 4: DESTRUCTURING ==");
const d = demoDestructuring();
cek("object basic", d.objectBasic.firstName === "John" && d.objectBasic.lastName === "Doe");
cek("rename", d.objectRenamed.fName === "John" && d.objectRenamed.lName === "Doe");
cek("default hobby", d.objectDefault === "coding");
cek("nested destructuring", d.objectNested.city === "Jakarta" && d.objectNested.postalCode === "12345");
cek("array basic", d.arrayBasic.firstColor === "red" && d.arrayBasic.secondColor === "green");
cek("skip elemen", d.arraySkipped === "blue");
cek("rest array", d.arrayRest.restColors.join(",") === "blue,yellow,purple");
cek("swap variable", d.swapped.a === 2 && d.swapped.b === 1);

console.log("== DEMO 5: SPREAD/REST ==");
const s = demoSpreadRest();
cek("spread array", s.spreadArray.join(",") === "1,2,3,4,5");
cek("copy array", s.copyArray.join(",") === "1,2,3");
cek("merge array", s.mergedArrays.join(",") === "1,2,3,4,5,6");
cek("spread objek override", s.spreadObject.age === 31 && s.spreadObject.email === "john@example.com");
cek("rest sum", s.restSum === 15);
cek("rest dengan param reguler", s.restProcess.rest.join(",") === "c,d,e");

console.log("== DEMO 6: DEFAULT PARAMS ==");
const p = demoDefaultParams();
cek("cara lama fallback", p.oldWay === "Hello, Guest!");
cek("cara baru fallback", p.newWay === "Hello, Guest!");
cek("ekspresi createdAt ada", typeof p.withExpression.createdAt === "string");
cek("total = price * qty", p.usingPrevious.total === 2000000);

console.log("== DEMO 7: CLASSES ==");
const c = demoClasses();
cek("user info", c.user.info === "John Doe (john@example.com)");
cek("admin override info", c.admin.info.includes("- admin"));
cek("instanceof User", c.isUserInstance === true);
cek("admin instanceof User (inheritance)", c.isAdminInstance === true);
cek("admin hasAccess", c.admin.hasAccess === true);

console.log("== DEMO 8: OBJECT LITERALS ==");
const o = demoObjectLiterals();
cek("shorthand menghasilkan nilai sama", o.newWay.name === "John" && o.newWay.age === 30);
cek("method shorthand", o.methods.new === "Hello!" && o.methods.old === "Hello!");
cek("computed property", o.computedProps.skill1 === "JavaScript" && o.computedProps.skill2 === "React");

console.log("== DEMO 9: ARRAY METHODS ==");
const m = demoArrayMethods();
cek("map doubled", m.map.join(",") === "2,4,6,8,10,12,14,16,18,20");
cek("filter genap", m.filter.evenNumbers.join(",") === "2,4,6,8,10");
cek("filter user aktif = 3", m.filter.activeUsers === 3);
cek("find Jane", m.find.name === "Jane");
cek("some hasAdult", m.some === true);
cek("every allAdults", m.every === true);
cek("reduce sum", m.reduce.sum === 55);
cek("reduce oldest = Charlie", m.reduce.oldest === "Charlie");
cek("chaining nama user aktif", m.chaining.activeUsersNames.join(",") === "John,Bob,Alice");
cek("chaining total umur = 75", m.chaining.totalActiveAge === 75);

console.log("== DEMO 10: ADVANCED ARRAYS ==");
const ad = demoAdvancedArrays();
cek("clone", ad.clone.join(",") === "1,2,3,4,5");
cek("Array.from dengan mapFn (kuadrat)", ad.arrayFrom.withMapFn.join(",") === "1,4,9,16,25");
cek("Array.of", ad.arrayOf.length === 3 && ad.arrayOf[1] === "two");
cek("flat 1 level", ad.flatAndFlatMap.flattened.join(",") === "1,2,3,4,5,6");
cek("flat 2 level", ad.flatAndFlatMap.deepFlattened.join(",") === "1,2,3,4,5,6");
cek("flatMap", ad.flatAndFlatMap.flatMapped.join(",") === "1,2,2,4,3,6,4,8,5,10");
cek("includes", ad.includes === true);

console.log(`\nHASIL: ${lulus} lulus, ${gagal} gagal`);
if (gagal > 0) process.exit(1);
