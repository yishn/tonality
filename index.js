exports.transpose = function(interval, notes) {
    return notes.map(x => x + interval)
}
