let t

class Tonality {
    constructor(notes) {
        if (toString.call(notes) === '[object String]') {
            notes = notes.trim().split(/\s+/).map(x => {
                let notation = 'c+d+ef+g+a+b'
                let index = notation.indexOf(x[0])
                let octave = 0

                if (index < 0) throw new Error('Invalid notes')

                while (["'", ','].includes(x.slice(-1))) {
                    if (x.slice(-1) == "'") octave++
                    else octave--

                    x = x.slice(0, x.length - 1)
                }

                let doublesharp = x.slice(-4) == 'isis'
                let doubleflat = x.slice(-4) == 'eses' || x == 'ases'
                let sharp = x.slice(-2) == 'is'
                let flat = x.slice(-2) == 'es' || x == 'as'

                return index + 12 * octave + +sharp + +doublesharp - +flat - +doubleflat
            })
        }

        this.notes = []

        for (let i = 0; i < notes.length; i++) {
            if (Math.floor(notes[i]) != Math.ceil(notes[i]))
                throw new Error('Invalid notes')

            this.notes.push(notes[i])
        }
    }

    transpose(interval) {
        return t(this.notes.map(x => x + interval))
    }

    render(key = 'c') {
        let notation = 'c+d+ef+g+a+b'
        let accidentals = t.getAccidentals(key)

        return this.notes.map((n, i) => {
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
                if (key == 'fis' && notation[norm] == 'f') {
                    result += 'eis'
                } else if (key == 'ges' && notation[norm] == 'b') {
                    result += 'ces'
                } else {
                    result += notation[norm]
                }
            } else {
                let sharp = notation[norm - 1] + 'is'
                let flat = (notation[norm + 1] + 'es').replace(/(e|a)e/, '$1')

                if (accidentals.includes(flat)) {
                    result += flat
                } else {
                    result += sharp
                }
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

module.exports = t = function(notes) {
    return new Tonality(notes)
}

t.equals = function(t1, t2) {
    if (t1.notes.length != t2.notes.length) return false
    return t1.notes.every((n, i) => t2.notes[i] == n)
}

t.getAccidentals = function(key) {
    let keys = ['ges', 'es', 'as', 'es', 'bes', 'f', 'c', 'g', 'd', 'a', 'e', 'h', 'fis']
    let sharps = 'fcgdae'.split('')
    let flats = 'beadgc'.split('')
    let index = keys.indexOf(key)

    if (index < 0) return []
    index -= 6

    if (index > 0) {
        return sharps.slice(0, index).map(x => x + 'is')
    } else {
        return flats.slice(0, -index).map(x => (x + 'es').replace(/(e|a)e/, '$1'))
    }
}
