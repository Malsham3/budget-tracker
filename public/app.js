let db;

//open database with the name of budget
const request = indexedDB.open("budget");

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  // Create an objectStore to hold transactions
  db.createObjectStore("pending", { autoincrement: true });
};

//triggered if the onupgradeneeded event exits successfully
request.onsuccess = function (event) {
  db = event.target.result;

  //if the status of the browser is online, run checkDatabase function.
  if (navigator.onLine) {
    checkDatabase();
  }
};

//Check database function
function checkDatabase() {

  // Store values in the newly created objectStore.
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  //get an array of all the objects in an object store
  const getAll = store.getAll();

  //triggered if the getAll function executes successfully
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((data = data.json()))
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");

          const store = transaction.objectStore("pending");

          store.clear();
        });
    }
  };
}

//saveRecord starts a transaction and makes a request to add data (new transaction)
function saveRecord(entry) {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(entry);
}

//Execute checkDatabase function when the browser status is online.
window.addEventListener("online", checkDatabase);
