const assert = require('assert')
const tt = require('../index')

describe('constructor', function() {
    it('should detect invalid notes', function() {
        assert.throws(() => tt([0, 0.5, 1, 1.3]))
        assert.throws(() => tt([0, 'blah', 1]))
    })
})

describe('transpose', function() {
    it('should work', function() {
        assert(tt.equals(
            tt([0, 1, 2, 3, 4, 5, 6, 7, 8]).transpose(2),
            tt([2, 3, 4, 5, 6, 7, 8, 9, 10])
        ))
    })
})

describe('render', function() {
    let scale = tt([0, 2, 4, 5, 7, 9, 11])

    it('should return right notes', function() {
        assert.equal(
            scale.render(),
            'c d e f g a b'
        )
    })
    it('should return right octave', function() {
        assert.equal(
            scale.transpose(12).render(),
            "c' d' e' f' g' a' b'"
        )
        assert.equal(
            scale.transpose(-24).render(),
            "c,, d,, e,, f,, g,, a,, b,,"
        )
    })
    it('should get accidentals right', function() {
        assert.equal(
            scale.transpose(2).render('d'),
            "d e fis g a b cis'"
        )
        assert.equal(
            scale.transpose(-2).render('bes'),
            'bes, c d es f g a'
        )
    })
})

describe('getAccidentals', function() {
    it('should return empty list for c', function() {
        assert.deepEqual(tt.getAccidentals('c'), [])
    })
    it('should return right number of sharps', function() {
        assert.equal(tt.getAccidentals('h').length, 5)
    })
    it('should return right number of flats', function() {
        assert.equal(tt.getAccidentals('ges').length, 6)
    })
})
