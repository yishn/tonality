let t

class Tonality {
    constructor(notes) {
        if (notes instanceof Tonality) {
            this.notes = notes.clone().notes
        } else if (toString.call(notes) === '[object Number]') {
            this.notes = [notes]
        } else if (toString.call(notes) === '[object String]') {
            this.notes = notes.trim().split(/\s+/).map(x => {
                x = x.toLowerCase()

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
        } else {
            this.notes = []

            for (let i = 0; i < notes.length; i++) {
                if (Math.floor(notes[i]) != Math.ceil(notes[i]))
                    throw new Error('Invalid notes')

                this.notes.push(notes[i])
            }
        }
    }

    clone() {
        return t(this.notes)
    }

    transpose(semitones) {
        return t(this.notes.map(x => x + semitones))
    }

    reverse() {
        return t(this.notes.slice(0).reverse())
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

t.getInterval = function(n1, n2) {
    let t1 = t(n1), t2 = t(n2)
    return t2.notes[0] - t1.notes[0]
}

t.getAccidentals = function(key) {
    key = key.toLowerCase()

    let keys = ['ges', 'des', 'as', 'es', 'bes', 'f', 'c', 'g', 'd', 'a', 'e', 'h', 'fis']
    let sharps = 'fcgdae'.split('')
    let flats = 'beadgc'.split('')
    let minor = key.slice(-1) == 'm'
    let index = keys.indexOf(key.replace('m', '').replace(/[',]*$/, ''))

    if (index < 0) return []
    if (minor) index = (index - 3 + keys.length - 1) % (keys.length - 1)
    index -= 6

    if (index > 0) return sharps.slice(0, index).map(x => x + 'is')
    return flats.slice(0, -index).map(x => (x + 'es').replace(/(e|a)e/, '$1'))
}

t.getDualKey = function(key) {
    key = key.toLowerCase()

    let minor = key.slice(-1) == 'm'
    let note = t(key.replace('m', ''))
    let dual = note.transpose(minor ? 3 : -3).render(key).replace(/[',]*$/, '')

    return dual + (minor ? '' : 'm')
}

t.getScale = function(key, shift = 0) {
    let scale, cut, transpose
    let minor = key.slice(-1) == 'm'

    if (minor) {
        scale = t.getScale(t.getDualKey(key), -2)
        transpose = t.getInterval(scale.notes[0], key.replace('m', ''))
    } else {
        scale = t([0, 2, 4, 5, 7, 9, 11])
        transpose = t.getInterval('c', key)
    }

    scale = scale.transpose(transpose)

    if (shift > 0) {
        cut = scale.notes.splice(0, shift).map(x => x + 12)
        scale.notes.push(...cut)
    } else if (shift < 0) {
        cut = scale.notes.splice(shift, -shift).map(x => x - 12)
        scale.notes.unshift(...cut)
    }

    return scale
}
