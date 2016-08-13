let tt

class Tritonus {
    constructor(notes) {
        this.notes = notes
    }

    transpose(interval) {
        return tt(this.notes.map(x => x + interval))
    }

    isValid() {
        return this.notes.every(x => Math.floor(2 * x) === Math.ceil(2 * x))
    }
}

module.exports = tt = function(notes) {
    return new Tritonus(notes)
}

tt.equals = function(t1, t2) {
    if (t1.notes.length != t2.notes.length) return false
    return t1.notes.every((n, i) => t2.notes[i] === n)
}
