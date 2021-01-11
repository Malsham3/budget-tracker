let db;
const request = indexedDB.open("budget");

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  //creating object store
  db.createObjectStore("pending", { autoincrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.createObjectStore("pending");

  const getAll = store.getAll();

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

function saveRecord(entry) {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(entry);
}

window.addEventListener("online", checkDatabase);
