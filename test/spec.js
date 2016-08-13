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
    it('should return right notes', function() {
        assert.equal(
            tt([0, 2, 4, 5, 7, 9, 11]).render(),
            'c d e f g a b'
        )
    })
    it('should return right octave', function() {
        assert.equal(
            tt([0, 2, 4, 5, 7, 9, 11]).transpose(12).render(),
            "c' d' e' f' g' a' b'"
        )
        assert.equal(
            tt([0, 2, 4, 5, 7, 9, 11]).transpose(-24).render(),
            "c,, d,, e,, f,, g,, a,, b,,"
        )
    })
})
