function timediff(t1, t2) {
    console.log(Math.floor( (new Date(t1).getTime() - new Date(t2)) / (24 * 60 * 60 * 1000)));
}

timediff('2016-08-19 22:00','2016-08-03 08:00');