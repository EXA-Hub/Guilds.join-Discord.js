function getRandom(arr, num = 1) {
    const res = [];
    for (let i = 0; i < num;) {
        const random = Math.floor(Math.random() * arr.length);
        if (res.indexOf(arr[random]) !== -1) {
            continue;
        };
        res.push(arr[random]);
        i++;
    };
    return res;
};

module.exports = getRandom;