let tt

class Tritonus {
    constructor(notes) {
        this.notes = []

        for (let i = 0; i < notes.length; i++) {
            if (Math.floor(notes[i]) != Math.ceil(notes[i]))
                throw new Error('Invalid notes')

            this.notes.push(notes[i])
        }
    }

    transpose(interval) {
        return tt(this.notes.map(x => x + interval))
    }

    render(context) {
        let notation = 'c+d+ef+g+a+b'

        return this.notes.map(n => {
            let mod = notation.length
            let octave = 0
            let norm = n
            let result = ''

            while (norm < 0) {
                norm += mod
                octave--
            }

            while (norm >= mod) {
                norm -= mod
                octave++
            }

            if (notation[norm] != '+') {
                result += notation[norm]
            } else {
                result += notation[norm - 1] + 'is'
            }

            while (octave < 0) {
                result += ','
                octave++
            }

            while (octave > 0) {
                result += "'"
                octave--
            }

            return result
        }).join(' ')
    }
}

module.exports = tt = function(notes) {
    return new Tritonus(notes)
}

tt.equals = function(t1, t2) {
    if (t1.notes.length != t2.notes.length) return false
    return t1.notes.every((n, i) => t2.notes[i] == n)
}