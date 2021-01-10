const db = e.target.result;
const request = indexedDB.open('budget')


request.onupgradeneeded = function (e) {
    db.createObjectStore('pending', { autoincrement: true});
};

request.onsuccess = function (e) {
    if(navigator.onLine) {
        checkDatabase();
    } 
};

function checkDatabase() {
    const transaction = db.transaction(['pending'], 'readwrite');

    const store = transaction.createObjectStore('pending');

    const getAll = store.getAll().result;

    getAll.onsuccess = function () {
        if (getAll.length > 0) {
            fetch ('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                }
            }).then(data = data.json())
            .then(() => {
                const transaction = db.transaction(['pending'], 'readwrite');

                const store = transaction.objectStore('pending');

                store.clear(); 
            });
        }
    };
}

function saveRecord(entry) {
    const transaction = db.transaction(['pending'], 'readwrite');

    const store = transaction.objectStore('pending');

    store.add(entry)
}

window.addEventListener('online', checkDatabase)